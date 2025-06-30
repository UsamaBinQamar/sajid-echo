
import { supabase } from '@/integrations/supabase/client';

export const validateUserAccess = async (resourceUserId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id === resourceUserId;
  } catch (error) {
    console.error('Access validation failed:', error);
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  // Basic sanitization for preventing XSS
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .substring(0, 10000); // Limit length
};

export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav'];

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed' };
  }

  return { isValid: true };
};

export const createSecureHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

// Rate limiting helper for client-side operations
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(private maxAttempts: number = 5, private windowMs: number = 60000) {}
  
  checkLimit(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }
}

export const rateLimiter = new RateLimiter();
