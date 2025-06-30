
export interface CategoryInfo {
  label: string;
  description: string;
  color: string;
  icon?: string;
}

export const categoryMappings: Record<string, CategoryInfo> = {
  'authentic_leadership': {
    label: 'Authentic Leadership',
    description: 'Building genuine leadership presence and self-awareness',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '🎯'
  },
  'boundaries_burnout': {
    label: 'Boundaries & Burnout',
    description: 'Managing workload, setting limits, and preventing burnout',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '⚖️'
  },
  'power_identity_politics': {
    label: 'Power, Identity & Politics',
    description: 'Navigating organizational dynamics and identity in leadership',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: '⚡'
  },
  'team_dynamics': {
    label: 'Team Dynamics',
    description: 'Building effective teams and managing relationships',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '👥'
  },
  'inclusive_leadership': {
    label: 'Inclusive Leadership',
    description: 'Creating inclusive environments and leading diverse teams',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    icon: '🌍'
  },
  'communication_feedback': {
    label: 'Communication & Feedback',
    description: 'Effective communication and delivering constructive feedback',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: '💬'
  },
  'conflict_resolution': {
    label: 'Conflict Resolution',
    description: 'Managing and resolving workplace conflicts',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '🤝'
  },
  'change_management': {
    label: 'Change Management',
    description: 'Leading organizational change and transformation',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🔄'
  }
};

// Enhanced tag system with identity-focused categories
export const tagCategories = {
  identity: {
    label: 'Identity & Culture',
    tags: ['identity integration', 'code switching', 'cultural navigation', 'intersectionality', 'belonging'],
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  skills: {
    label: 'Leadership Skills',
    tags: ['active listening', 'empathy', 'delegation', 'decision making', 'strategic thinking'],
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  context: {
    label: 'Situational Context',
    tags: ['power dynamics', 'organizational politics', 'remote work', 'crisis management', 'change'],
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  communication: {
    label: 'Communication',
    tags: ['difficult conversations', 'feedback delivery', 'public speaking', 'negotiation', 'storytelling'],
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  }
};

export const getCategoryInfo = (category: string): CategoryInfo => {
  return categoryMappings[category] || {
    label: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Leadership development scenario',
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  };
};

// Get tag category for styling
export const getTagCategory = (tag: string) => {
  for (const [categoryKey, categoryData] of Object.entries(tagCategories)) {
    if (categoryData.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(t.toLowerCase()))) {
      return { key: categoryKey, ...categoryData };
    }
  }
  return { key: 'general', label: 'General', color: 'bg-gray-50 text-gray-700 border-gray-200', tags: [] };
};

// Enhanced scenario complexity indicators (replacing difficulty levels)
export const getComplexityInfo = (scenario: any) => {
  const indicators = [];
  
  if (scenario.cultural_context) indicators.push('Cultural Awareness');
  if (scenario.power_dynamics) indicators.push('Power Dynamics');
  if (scenario.trigger_warnings?.length > 0) indicators.push('Sensitive Content');
  if (scenario.preparation_guidance) indicators.push('Preparation Required');
  
  return indicators;
};

// Duration-based categorization
export const getDurationCategory = (minutes: number) => {
  if (minutes <= 10) return { label: 'Quick Practice', color: 'text-green-600', icon: '⚡' };
  if (minutes <= 20) return { label: 'Standard Session', color: 'text-blue-600', icon: '🎯' };
  return { label: 'Deep Dive', color: 'text-purple-600', icon: '🔍' };
};

export const commonSearchTerms = [
  'difficult conversation',
  'team conflict',
  'feedback',
  'boundaries',
  'burnout',
  'inclusion',
  'diversity',
  'power dynamics',
  'communication',
  'delegation',
  'performance',
  'culture',
  'trust',
  'authenticity',
  'identity integration',
  'code switching',
  'intersectionality',
  'belonging'
];

export const quickFilters = [
  { label: 'Communication', searchTerms: ['communication', 'feedback', 'conversation'] },
  { label: 'Conflict', searchTerms: ['conflict', 'disagreement', 'tension'] },
  { label: 'Inclusion', searchTerms: ['inclusion', 'diversity', 'belonging'] },
  { label: 'Identity', searchTerms: ['identity integration', 'code switching', 'intersectionality'] },
  { label: 'Boundaries', searchTerms: ['boundaries', 'burnout', 'workload'] },
  { label: 'Trust', searchTerms: ['trust', 'authenticity', 'transparency'] },
  { label: 'Performance', searchTerms: ['performance', 'accountability', 'expectations'] }
];
