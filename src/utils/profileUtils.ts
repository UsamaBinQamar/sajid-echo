
export interface ProfileCompletionCheck {
  isComplete: boolean;
  hasEssentialFields: boolean;
}

export const checkProfileCompletion = (profile: any): ProfileCompletionCheck => {
  if (!profile) {
    return {
      isComplete: false,
      hasEssentialFields: false
    };
  }

  // Consider profile complete if it has leadership_role and focus_areas
  const hasEssentialFields = !!(profile.leadership_role && profile.focus_areas && profile.focus_areas.length > 0);

  return {
    isComplete: hasEssentialFields,
    hasEssentialFields
  };
};
