
/**
 * Utility functions for handling user names in a warm, personal way
 */

export const getPersonalName = (profile: any, user?: any): string => {
  // First priority: preferred_name from profile
  if (profile?.preferred_name?.trim()) {
    return profile.preferred_name.trim();
  }

  // Second priority: first word of full_name from profile
  if (profile?.full_name?.trim()) {
    const firstName = profile.full_name.trim().split(' ')[0];
    if (firstName) return firstName;
  }

  // Third priority: first word of full_name from user metadata
  if (user?.user_metadata?.full_name?.trim()) {
    const firstName = user.user_metadata.full_name.trim().split(' ')[0];
    if (firstName) return firstName;
  }

  // Fourth priority: extract from email
  if (user?.email) {
    const emailPrefix = user.email.split('@')[0];
    // Clean up common email patterns
    const cleanName = emailPrefix
      .replace(/[._-]/g, ' ')
      .split(' ')[0];
    
    // Capitalize first letter
    if (cleanName) {
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
  }

  // Friendly fallback
  return "friend";
};
