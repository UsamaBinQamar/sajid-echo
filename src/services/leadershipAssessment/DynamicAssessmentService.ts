
import { LeadershipAssessmentService } from "./LeadershipAssessmentService";
import { DynamicQuestionSelector } from "./DynamicQuestionSelector";

export class DynamicAssessmentService {
  static async getRecommendedDynamicAssessment(userId: string) {
    // Get the category that needs the most attention based on user history
    const recommendedCategory = await this.getRecommendedCategory(userId);
    
    if (!recommendedCategory) {
      console.log('No recommended category found, using values_alignment as default');
      return await LeadershipAssessmentService.createDynamicAssessment(userId, 'values_alignment');
    }

    return await LeadershipAssessmentService.createDynamicAssessment(userId, recommendedCategory);
  }

  private static async getRecommendedCategory(userId: string): Promise<string | null> {
    const categories = [
      'values_alignment',
      'emotional_energy', 
      'authenticity',
      'boundaries_boldness',
      'voice_visibility',
      'bias_navigation'
    ];

    // Simple rotation strategy - can be enhanced with more sophisticated logic
    const dayOfWeek = new Date().getDay();
    const categoryIndex = dayOfWeek % categories.length;
    
    return categories[categoryIndex];
  }

  static async getAllAvailableCategories(): Promise<string[]> {
    return [
      'values_alignment',
      'emotional_energy', 
      'authenticity',
      'boundaries_boldness',
      'voice_visibility',
      'bias_navigation'
    ];
  }

  static async createAssessmentForCategory(userId: string, category: string) {
    return await LeadershipAssessmentService.createDynamicAssessment(userId, category);
  }
}
