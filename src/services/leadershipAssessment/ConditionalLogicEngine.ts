
import { ReflectionPrompt, TriggerCondition } from "./types";

export class ConditionalLogicEngine {
  static evaluateConditions(
    conditions: TriggerCondition[],
    responses: Record<string, any>
  ): boolean {
    return conditions.every(condition => {
      const responseValue = responses[condition.question_key];
      
      switch (condition.operator) {
        case 'equals':
          return responseValue === condition.value;
        
        case 'greater_than':
          return typeof responseValue === 'number' && responseValue > condition.value;
        
        case 'less_than':
          return typeof responseValue === 'number' && responseValue < condition.value;
        
        case 'contains':
          if (Array.isArray(responseValue)) {
            return responseValue.includes(condition.value);
          }
          if (typeof responseValue === 'string') {
            return responseValue.includes(condition.value);
          }
          return false;
        
        default:
          return false;
      }
    });
  }

  static getTriggeredPrompts(
    prompts: ReflectionPrompt[],
    responses: Record<string, any>
  ): ReflectionPrompt[] {
    return prompts.filter(prompt => {
      if (!prompt.trigger_conditions || prompt.trigger_conditions.length === 0) {
        return true; // Show prompts with no conditions
      }
      
      return this.evaluateConditions(prompt.trigger_conditions, responses);
    });
  }

  static generatePersonalizedPrompts(
    category: string,
    responses: Record<string, any>
  ): ReflectionPrompt[] {
    const basePrompts: Record<string, ReflectionPrompt[]> = {
      values_alignment: [
        {
          key: 'values_challenge',
          text: 'Describe a recent situation where your values were challenged. How did you navigate it?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'values_consistency',
            operator: 'less_than',
            value: 4
          }]
        },
        {
          key: 'values_strength',
          text: 'What values-based decision are you most proud of in your leadership?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'values_consistency',
            operator: 'greater_than',
            value: 3
          }]
        }
      ],
      emotional_energy: [
        {
          key: 'energy_management',
          text: 'What is one practice you could implement this week to better manage your energy?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'energy_drain',
            operator: 'greater_than',
            value: 3
          }]
        },
        {
          key: 'energy_sources',
          text: 'How can you create more opportunities for the activities that energize you?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'energy_awareness',
            operator: 'greater_than',
            value: 3
          }]
        }
      ],
      authenticity: [
        {
          key: 'authentic_challenge',
          text: 'In what settings do you find it most challenging to be authentic? What would help you feel safer?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'authenticity_difficulty',
            operator: 'greater_than',
            value: 3
          }]
        },
        {
          key: 'authentic_growth',
          text: 'What is one step you can take this week to express your authentic self more confidently?',
          type: 'text',
          trigger_conditions: []
        }
      ],
      boundaries_boldness: [
        {
          key: 'boundary_practice',
          text: 'Think of a boundary you need to set. What would you say and how would you say it?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'boundary_difficulty',
            operator: 'greater_than',
            value: 3
          }]
        },
        {
          key: 'boldness_opportunity',
          text: 'What is one area where you could be bolder in your leadership this month?',
          type: 'text',
          trigger_conditions: []
        }
      ],
      voice_visibility: [
        {
          key: 'voice_barriers',
          text: 'What holds you back from speaking up more? How might you address these barriers?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'voice_frequency',
            operator: 'less_than',
            value: 4
          }]
        },
        {
          key: 'visibility_strategy',
          text: 'How can you better showcase your contributions and impact?',
          type: 'text',
          trigger_conditions: []
        }
      ],
      bias_navigation: [
        {
          key: 'bias_strategy',
          text: 'What strategies have you found most effective for addressing bias when you encounter it?',
          type: 'text',
          trigger_conditions: [{
            question_key: 'bias_frequency',
            operator: 'greater_than',
            value: 2
          }]
        },
        {
          key: 'support_system',
          text: 'How can you strengthen your support system for navigating challenging situations?',
          type: 'text',
          trigger_conditions: []
        }
      ]
    };

    const categoryPrompts = basePrompts[category] || [];
    return this.getTriggeredPrompts(categoryPrompts, responses);
  }
}
