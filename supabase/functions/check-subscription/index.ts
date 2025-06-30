
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, checking for free tier subscription");
      
      // Check if user has a free tier subscription
      const { data: existingSubscription } = await supabaseClient
        .from('subscribers')
        .select(`
          *,
          subscription_tier:subscription_tiers(*)
        `)
        .eq('user_id', user.id)
        .single();

      if (!existingSubscription) {
        // Set up free tier by default
        const { data: freeTier } = await supabaseClient
          .from('subscription_tiers')
          .select('*')
          .eq('slug', 'free')
          .single();

        if (freeTier) {
          await supabaseClient.from('subscribers').upsert({
            user_id: user.id,
            email: user.email,
            subscription_tier_id: freeTier.id,
            status: 'active'
          }, { onConflict: 'user_id' });
          
          logStep("Free tier subscription created");
          return new Response(JSON.stringify({
            subscribed: true,
            subscription_tier: 'Leadership Explorer',
            subscription_status: 'active'
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      }

      return new Response(JSON.stringify({ 
        subscribed: false,
        subscription_tier: 'Leadership Explorer',
        subscription_status: 'inactive'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = 'Leadership Explorer';
    let subscriptionEnd = null;
    let tierInfo = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const { data: tierData } = await supabaseClient
        .from('subscription_tiers')
        .select('*')
        .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
        .single();

      if (tierData) {
        subscriptionTier = tierData.name;
        tierInfo = tierData;
        logStep("Found tier from Stripe price", { tierName: tierData.name, priceId });
      } else {
        // Fallback: determine tier based on price amount
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount <= 0) {
          subscriptionTier = 'Leadership Explorer';
        } else if (amount <= 999) {
          subscriptionTier = 'Leadership Professional';
          // Get the premium tier
          const { data: premiumTier } = await supabaseClient
            .from('subscription_tiers')
            .select('*')
            .eq('slug', 'premium')
            .single();
          tierInfo = premiumTier;
        } else {
          subscriptionTier = 'Leadership Enterprise';
          // Get the team tier
          const { data: teamTier } = await supabaseClient
            .from('subscription_tiers')
            .select('*')
            .eq('slug', 'team')
            .single();
          tierInfo = teamTier;
        }
        
        logStep("Determined tier from price amount", { amount, subscriptionTier });
      }

      // Update subscription in database
      await supabaseClient.from('subscribers').upsert({
        user_id: user.id,
        email: user.email,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        subscription_tier_id: tierInfo?.id,
        status: 'active',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    } else {
      logStep("No active subscription found, setting free tier");
      
      const { data: freeTier } = await supabaseClient
        .from('subscription_tiers')
        .select('*')
        .eq('slug', 'free')
        .single();

      await supabaseClient.from('subscribers').upsert({
        user_id: user.id,
        email: user.email,
        stripe_customer_id: customerId,
        subscription_tier_id: freeTier?.id,
        status: 'inactive',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_status: hasActiveSub ? 'active' : 'inactive',
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
