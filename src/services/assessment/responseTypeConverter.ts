
/**
 * Centralized utility for converting and validating assessment responses
 */

export type ValidResponseType = number | string | string[];

export interface ResponseValidationResult {
  isValid: boolean;
  convertedValue: ValidResponseType;
  error?: string;
}

export class ResponseTypeConverter {
  /**
   * Safely converts any response value to a number
   */
  static toNumber(response: any, defaultValue: number = 3): number {
    if (typeof response === 'number') {
      return isNaN(response) ? defaultValue : Math.max(1, Math.min(5, Math.round(response)));
    }
    
    if (typeof response === 'string') {
      const parsed = parseFloat(response);
      return isNaN(parsed) ? defaultValue : Math.max(1, Math.min(5, Math.round(parsed)));
    }
    
    if (Array.isArray(response) && response.length > 0) {
      const firstNumber = this.toNumber(response[0], defaultValue);
      return firstNumber;
    }
    
    return defaultValue;
  }

  /**
   * Safely converts any response value to a string
   */
  static toString(response: any): string {
    if (typeof response === 'string') return response;
    if (typeof response === 'number') return response.toString();
    if (Array.isArray(response)) return response.join(', ');
    if (typeof response === 'object') return JSON.stringify(response);
    return String(response);
  }

  /**
   * Safely converts any response value to a string array
   */
  static toStringArray(response: any): string[] {
    if (Array.isArray(response)) {
      return response.map(item => this.toString(item));
    }
    if (typeof response === 'string') {
      // Handle comma-separated values
      return response.split(',').map(item => item.trim()).filter(Boolean);
    }
    return [this.toString(response)];
  }

  /**
   * Validates and converts response based on expected type
   */
  static validateAndConvert(
    response: any, 
    expectedType: 'number' | 'string' | 'string_array',
    questionId: string
  ): ResponseValidationResult {
    try {
      switch (expectedType) {
        case 'number':
          const numValue = this.toNumber(response);
          return {
            isValid: true,
            convertedValue: numValue
          };
          
        case 'string':
          const strValue = this.toString(response);
          return {
            isValid: strValue.length > 0,
            convertedValue: strValue,
            error: strValue.length === 0 ? 'Response cannot be empty' : undefined
          };
          
        case 'string_array':
          const arrValue = this.toStringArray(response);
          return {
            isValid: arrValue.length > 0,
            convertedValue: arrValue,
            error: arrValue.length === 0 ? 'At least one option must be selected' : undefined
          };
          
        default:
          return {
            isValid: false,
            convertedValue: response,
            error: `Unknown expected type: ${expectedType}`
          };
      }
    } catch (error) {
      return {
        isValid: false,
        convertedValue: response,
        error: `Conversion error for question ${questionId}: ${error}`
      };
    }
  }

  /**
   * Determines the expected response type based on question configuration
   */
  static getExpectedResponseType(question: any): 'number' | 'string' | 'string_array' {
    if (!question) return 'number';
    
    // Check question type
    if (['mood', 'stress', 'energy', 'slider'].includes(question.type)) {
      return 'number';
    }
    
    if (question.type === 'multiple_choice') {
      return question.multiple_select ? 'string_array' : 'string';
    }
    
    if (['ranking', 'action_commitment'].includes(question.type)) {
      return 'string_array';
    }
    
    // Default fallback
    return 'number';
  }
}
