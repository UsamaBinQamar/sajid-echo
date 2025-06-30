
import { supabase } from "@/integrations/supabase/client";
import { identityAwareScenarios } from './identityAwareScenarios/index';

export { identityAwareScenarios };

export const seedIdentityAwareScenarios = async () => {
  try {
    console.log('Starting identity-aware scenarios seeding...');
    const results = [];
    
    for (const scenario of identityAwareScenarios) {
      try {
        console.log(`Processing identity-aware scenario: ${scenario.title}`);
        
        // Check if scenario exists by title
        const { data: existing } = await supabase
          .from('dialogue_scenarios')
          .select('id, title')
          .eq('title', scenario.title)
          .single();

        if (existing) {
          console.log(`Updating existing scenario: ${scenario.title}`);
          const { data, error } = await supabase
            .from('dialogue_scenarios')
            .update(scenario)
            .eq('id', existing.id)
            .select()
            .single();
          
          if (error) {
            console.error(`Error updating scenario ${scenario.title}:`, error);
          } else {
            results.push(data);
          }
        } else {
          console.log(`Inserting new scenario: ${scenario.title}`);
          const { data, error } = await supabase
            .from('dialogue_scenarios')
            .insert(scenario)
            .select()
            .single();
          
          if (error) {
            console.error(`Error inserting scenario ${scenario.title}:`, error);
          } else {
            results.push(data);
          }
        }
      } catch (scenarioError) {
        console.error(`Error processing scenario ${scenario.title}:`, scenarioError);
      }
    }

    console.log(`Identity-aware scenarios seeding completed. Processed: ${results.length}`);
    return { success: true, data: results };
  } catch (error) {
    console.error('Error in seedIdentityAwareScenarios:', error);
    return { success: false, error };
  }
};
