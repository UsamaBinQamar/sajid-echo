import { supabase } from "@/integrations/supabase/client";
import { SmartQuestion, AssessmentResponses } from "@/components/dashboard/smart-assessment/types";
import { ResponseTypeConverter } from "./responseTypeConverter";

export const enhancedAssessmentDataService = {
  async updateAssessmentPatterns(userId: string, responses: AssessmentResponses, questions: SmartQuestion[]) {
    try {
      console.log('🔄 Updating assessment patterns for user:', userId);

      // Group responses by category with improved error handling
      const categoryData: { [category: string]: { scores: number[]; questionCount: number } } = {};
      
      questions.forEach(question => {
        try {
          const score = responses[question.id];
          if (score === undefined) return;

          const category = this.mapQuestionTypeToCategory(question.type);
          
          if (!categoryData[category]) {
            categoryData[category] = { scores: [], questionCount: 0 };
          }
          
          // Use the centralized converter for consistency
          const numericScore = ResponseTypeConverter.toNumber(score);
          categoryData[category].scores.push(numericScore);
          categoryData[category].questionCount++;
          
        } catch (questionError) {
          console.error('⚠️ Error processing question for patterns:', question.id, questionError);
        }
      });

      // Update patterns for each category
      const updatePromises = Object.entries(categoryData).map(async ([category, data]) => {
        try {
          const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
          const hasLowScore = data.scores.some(score => score < 3);
          
          const trendDirection = this.calculateTrendDirection(avgScore);
          
          await supabase
            .from('assessment_patterns')
            .upsert({
              user_id: userId,
              category,
              avg_score: Number(avgScore.toFixed(2)),
              trend_direction: trendDirection,
              last_low_score_date: hasLowScore ? new Date().toISOString().split('T')[0] : null,
              question_frequency: data.questionCount,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,category'
            });
            
        } catch (categoryError) {
          console.error('⚠️ Error updating pattern for category:', category, categoryError);
        }
      });

      await Promise.allSettled(updatePromises);
      console.log('✅ Assessment patterns updated successfully');
      
    } catch (error) {
      console.error('❌ Error updating assessment patterns:', error);
      throw error;
    }
  },

  async generateInsightRecommendations(userId: string): Promise<void> {
    try {
      // Get recent patterns
      const { data: patterns } = await supabase
        .from('assessment_patterns')
        .select('*')
        .eq('user_id', userId);

      if (!patterns || patterns.length === 0) return;

      // Generate recommendations based on patterns
      const recommendations = [];
      
      for (const pattern of patterns) {
        if (pattern.avg_score < 3) {
          recommendations.push({
            type: 'improvement',
            category: pattern.category,
            message: `Your ${pattern.category.replace('_', ' ')} scores suggest room for growth. Consider focusing on this area.`,
            priority: 'high',
            action_items: this.getActionItemsForCategory(pattern.category)
          });
        } else if (pattern.trend_direction === 'declining') {
          recommendations.push({
            type: 'maintenance',
            category: pattern.category,
            message: `Your ${pattern.category.replace('_', ' ')} shows a declining trend. Let's work on maintaining your progress.`,
            priority: 'medium',
            action_items: [`Monitor ${pattern.category.replace('_', ' ')} more closely`, 'Identify potential stressors']
          });
        } else if (pattern.avg_score >= 4 && pattern.trend_direction === 'improving') {
          recommendations.push({
            type: 'strength',
            category: pattern.category,
            message: `Excellent work in ${pattern.category.replace('_', ' ')}! This is a key strength area for you.`,
            priority: 'low',
            action_items: ['Continue current practices', 'Consider mentoring others in this area']
          });
        }
      }

      // Store recommendations (you might want to create a recommendations table)
      console.log('Generated recommendations:', recommendations);
      
    } catch (error) {
      console.error('Error generating insight recommendations:', error);
    }
  },

  mapQuestionTypeToCategory(type: string): string {
    const categoryMap: { [key: string]: string } = {
      'mood': 'emotional_wellbeing',
      'stress': 'stress_management', 
      'energy': 'energy_management',
      'work_life_balance': 'work_life_balance',
      'communication': 'communication',
      'leadership': 'leadership',
      'team_dynamics': 'team_dynamics',
      'personal_growth': 'personal_growth',
      'conflict_resolution': 'conflict_resolution',
      'decision_making': 'decision_making'
    };

    return categoryMap[type] || 'general_wellbeing';
  },

  calculateTrendDirection(avgScore: number): string {
    if (avgScore >= 4) return 'improving';
    if (avgScore <= 2.5) return 'declining';
    return 'stable';
  },

  getActionItemsForCategory(category: string): string[] {
    const actionItems: { [key: string]: string[] } = {
      emotional_wellbeing: [
        'Practice daily emotional awareness',
        'Develop coping strategies',
        'Seek support when needed'
      ],
      stress_management: [
        'Implement stress reduction techniques',
        'Identify stress triggers',
        'Create recovery routines'
      ],
      work_life_balance: [
        'Set clear boundaries',
        'Prioritize personal time',
        'Review workload distribution'
      ],
      communication: [
        'Practice active listening',
        'Work on clarity in communication',
        'Seek feedback regularly'
      ],
      leadership: [
        'Develop leadership skills',
        'Practice inclusive leadership',
        'Seek mentorship'
      ]
    };

    return actionItems[category] || ['Continue developing in this area', 'Monitor progress regularly'];
  },

  async trackAssessmentCompletion(userId: string, assessmentType: 'quick' | 'full', questionCount: number) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await supabase
        .from('usage_tracking')
        .upsert({
          user_id: userId,
          feature_type: `assessment_${assessmentType}`,
          usage_count: 1,
          period_start: today,
          period_end: today
        }, {
          onConflict: 'user_id,feature_type,period_start'
        });

      console.log(`✅ Tracked ${assessmentType} assessment completion: ${questionCount} questions`);
    } catch (error) {
      console.error('❌ Error tracking assessment completion:', error);
    }
  }
};
