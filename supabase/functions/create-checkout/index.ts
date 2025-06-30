
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { tier_slug, billing_cycle = 'monthly', addons = [] } = await req.json();
    if (!tier_slug) throw new Error("Subscription tier is required");
    logStep("Request data parsed", { tier_slug, billing_cycle, addons });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Get subscription tier details
    const { data: tierData } = await supabaseClient
      .from('subscription_tiers')
      .select('*')
      .eq('slug', tier_slug)
      .single();

    if (!tierData) throw new Error("Invalid subscription tier");
    logStep("Found subscription tier", { tierName: tierData.name, price: tierData.price_monthly });

    // Build line items
    const lineItems = [];
    
    // Add main subscription
    if (tierData.price_monthly > 0) {
      const priceId = billing_cycle === 'yearly' ? tierData.stripe_price_id_yearly : tierData.stripe_price_id_monthly;
      if (!priceId) {
        // Create price dynamically if not set
        const price = await stripe.prices.create({
          currency: 'usd',
          unit_amount: billing_cycle === 'yearly' ? (tierData.price_yearly || tierData.price_monthly * 12) : tierData.price_monthly,
          recurring: {
            interval: billing_cycle === 'yearly' ? 'year' : 'month'
          },
          product_data: {
            name: `${tierData.name} - ${billing_cycle === 'yearly' ? 'Annual' : 'Monthly'}`,
            description: `Leadership development subscription - ${tierData.name}`
          }
        });
        lineItems.push({ price: price.id, quantity: 1 });
        logStep("Created dynamic price", { priceId: price.id, amount: price.unit_amount });
      } else {
        lineItems.push({ price: priceId, quantity: 1 });
        logStep("Using existing price", { priceId });
      }
    }

    // Add addon line items
    for (const addonSlug of addons) {
      const { data: addonData } = await supabaseClient
        .from('subscription_addons')
        .select('*')
        .eq('slug', addonSlug)
        .single();

      if (addonData && addonData.price_monthly > 0) {
        if (!addonData.stripe_price_id) {
          const price = await stripe.prices.create({
            currency: 'usd',
            unit_amount: addonData.price_monthly,
            recurring: { interval: 'month' },
            product_data: { name: addonData.name }
          });
          lineItems.push({ price: price.id, quantity: 1 });
        } else {
          lineItems.push({ price: addonData.stripe_price_id, quantity: 1 });
        }
      }
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    if (lineItems.length === 0) {
      // Free tier - just update the subscription status
      const serviceRoleClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      await serviceRoleClient
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email,
          subscription_tier_id: tierData.id,
          status: 'active'
        }, { onConflict: 'user_id' });

      logStep("Free tier subscription activated");
      return new Response(JSON.stringify({ 
        url: `${origin}/subscription/success?tier=${tier_slug}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier_slug}`,
      cancel_url: `${origin}/subscription/cancel?tier=${tier_slug}`,
      metadata: {
        user_id: user.id,
        tier_slug: tier_slug,
        billing_cycle: billing_cycle,
        addons: JSON.stringify(addons)
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
