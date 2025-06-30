
import { supabase } from "@/integrations/supabase/client";
import { identityAwareScenarios, seedIdentityAwareScenarios } from "./identityAwareScenarios";

export const sampleScenarios = [
  {
    title: "Team Conflict Resolution",
    description: "Navigate a heated conflict between two team members over project responsibilities",
    category: "conflict_resolution",
    difficulty_level: 3,
    estimated_duration_minutes: 20,
    scenario_setup: "Two of your best developers, Sarah and Mike, have been in ongoing conflict about code review processes. Sarah feels Mike is too critical, while Mike believes Sarah isn't following team standards.",
    initial_situation: "Sarah storms into your office looking upset. 'I can't work with Mike anymore! He's constantly nitpicking my code and questioning my decisions in front of the whole team. It's humiliating and unprofessional!'",
    therapeutic_context: "Practice empathetic listening, de-escalation techniques, and finding win-win solutions while maintaining team dynamics.",
    character_persona: {
      name: "Sarah Chen",
      role: "Senior Frontend Developer",
      personality: "Passionate, creative, values autonomy, sensitive to criticism",
      emotional_state: "frustrated and feeling undermined",
      background: "5 years experience, recently promoted, usually very collaborative"
    },
    learning_objectives: ["Active listening", "Emotional validation", "Conflict mediation", "Team dynamics"],
    focus_areas: ["empathy", "clarity", "inclusion"],
    emotional_intensity_level: 4,
    tags: ["conflict", "team management", "communication"]
  },
  {
    title: "Performance Feedback Conversation",
    description: "Deliver constructive feedback to an underperforming but well-meaning team member",
    category: "performance_management",
    difficulty_level: 2,
    estimated_duration_minutes: 15,
    scenario_setup: "Alex is a junior developer who consistently misses deadlines and delivers buggy code, but they're eager to learn and well-liked by the team.",
    initial_situation: "Alex sits down for their quarterly review with a nervous smile. 'I know I've been struggling a bit lately, but I've been trying really hard. I hope you've noticed some improvement!'",
    therapeutic_context: "Practice delivering feedback with compassion while maintaining clear expectations and accountability.",
    character_persona: {
      name: "Alex Rodriguez",
      role: "Junior Developer",
      personality: "Enthusiastic, eager to please, lacks confidence, defensive when criticized",
      emotional_state: "anxious but hopeful",
      background: "Recent bootcamp graduate, first tech job, very motivated but overwhelmed"
    },
    learning_objectives: ["Constructive feedback", "Motivation techniques", "Goal setting", "Supportive leadership"],
    focus_areas: ["empathy", "clarity"],
    emotional_intensity_level: 2,
    tags: ["performance", "feedback", "mentoring"]
  },
  {
    title: "Burnout Prevention Discussion",
    description: "Address signs of burnout with a high-performing team member before it becomes critical",
    category: "wellness_support",
    difficulty_level: 4,
    estimated_duration_minutes: 25,
    scenario_setup: "Jamie has been working excessive hours, missing team social events, and their usual enthusiasm seems dimmed. Other team members have expressed concern.",
    initial_situation: "Jamie looks exhausted during your one-on-one. When you ask how they're doing, they say, 'I'm fine, just busy. This project is really important and I want to make sure we hit our deadlines. I can handle it.'",
    therapeutic_context: "Practice recognizing burnout signs, creating psychological safety, and balancing performance with wellbeing.",
    character_persona: {
      name: "Jamie Park",
      role: "Tech Lead",
      personality: "Perfectionist, highly driven, tends to internalize stress, values achievement",
      emotional_state: "exhausted but trying to appear strong",
      background: "Top performer, recently promoted, struggling with new responsibilities"
    },
    learning_objectives: ["Burnout recognition", "Psychological safety", "Work-life balance", "Preventive care"],
    focus_areas: ["empathy", "inclusion"],
    emotional_intensity_level: 3,
    tags: ["burnout", "wellness", "high performer"]
  },
  {
    title: "Diversity and Inclusion Challenge",
    description: "Address inappropriate comments and foster inclusive behavior in team meetings",
    category: "diversity_inclusion",
    difficulty_level: 5,
    estimated_duration_minutes: 30,
    scenario_setup: "During a team meeting, Jordan made comments that made some team members uncomfortable. Taylor, one of the few women on the team, has requested to speak with you privately.",
    initial_situation: "Taylor closes your office door and takes a deep breath. 'I need to talk to you about what happened in today's meeting. Jordan's comments about 'girls in tech' weren't just inappropriate—they made me question whether I really belong here.'",
    therapeutic_context: "Practice addressing microaggressions, supporting affected team members, and creating inclusive environments.",
    character_persona: {
      name: "Taylor Kim",
      role: "Software Engineer",
      personality: "Professional, direct, values fairness, not afraid to speak up",
      emotional_state: "frustrated and questioning their place on the team",
      background: "3 years experience, one of few women on team, usually confident"
    },
    learning_objectives: ["Inclusive leadership", "Microaggression response", "Allyship", "Cultural sensitivity"],
    focus_areas: ["inclusion", "empathy", "clarity"],
    emotional_intensity_level: 4,
    trigger_warnings: ["workplace discrimination", "gender bias"],
    cultural_sensitivity_notes: "Focus on creating psychological safety while addressing systemic issues",
    tags: ["diversity", "inclusion", "microaggressions"]
  }
];

export const seedDialogueScenarios = async () => {
  try {
    console.log('Starting dialogue scenarios seeding process...');
    
    // First, seed original scenarios with proper conflict resolution
    console.log('Seeding original scenarios...');
    const originalResults = [];
    
    for (const scenario of sampleScenarios) {
      try {
        console.log(`Processing scenario: ${scenario.title}`);
        
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
            originalResults.push(data);
            console.log(`Successfully updated: ${scenario.title}`);
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
            originalResults.push(data);
            console.log(`Successfully inserted: ${scenario.title}`);
          }
        }
      } catch (scenarioError) {
        console.error(`Error processing scenario ${scenario.title}:`, scenarioError);
      }
    }

    // Seed identity-aware scenarios with improved error handling
    console.log('Seeding identity-aware scenarios...');
    const identityResults = [];
    
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
          console.log(`Updating existing identity-aware scenario: ${scenario.title}`);
          const { data, error } = await supabase
            .from('dialogue_scenarios')
            .update(scenario)
            .eq('id', existing.id)
            .select()
            .single();
          
          if (error) {
            console.error(`Error updating identity-aware scenario ${scenario.title}:`, error);
          } else {
            identityResults.push(data);
            console.log(`Successfully updated identity-aware: ${scenario.title}`);
          }
        } else {
          console.log(`Inserting new identity-aware scenario: ${scenario.title}`);
          const { data, error } = await supabase
            .from('dialogue_scenarios')
            .insert(scenario)
            .select()
            .single();
          
          if (error) {
            console.error(`Error inserting identity-aware scenario ${scenario.title}:`, error);
          } else {
            identityResults.push(data);
            console.log(`Successfully inserted identity-aware: ${scenario.title}`);
          }
        }
      } catch (scenarioError) {
        console.error(`Error processing identity-aware scenario ${scenario.title}:`, scenarioError);
      }
    }

    // Get final count
    const { count: totalCount } = await supabase
      .from('dialogue_scenarios')
      .select('*', { count: 'exact', head: true });

    console.log(`Seeding completed. Total scenarios in database: ${totalCount}`);
    console.log(`Original scenarios processed: ${originalResults.length}`);
    console.log(`Identity-aware scenarios processed: ${identityResults.length}`);

    return { 
      success: true, 
      data: { 
        original: originalResults, 
        identityAware: identityResults,
        totalCount 
      } 
    };
  } catch (error) {
    console.error('Error in seedDialogueScenarios:', error);
    return { success: false, error };
  }
};
