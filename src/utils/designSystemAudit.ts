/**
 * Design System Audit Utility
 * Provides functions to validate and enforce design system compliance
 */

// Design token mappings for common hardcoded values
export const colorTokenMap = {
  // Common hardcoded colors to semantic tokens
  '#ffffff': 'hsl(var(--background))',
  '#000000': 'hsl(var(--foreground))',
  'white': 'hsl(var(--background))',
  'black': 'hsl(var(--foreground))',
  '#f9fafb': 'hsl(var(--muted))',
  '#6366f1': 'hsl(var(--primary))',
  '#10b981': 'hsl(var(--accent))',
  '#ef4444': 'hsl(var(--destructive))',
  '#c2410c': 'hsl(var(--warning))', // Updated to burnt orange
  '#3b82f6': 'hsl(var(--info))',
  
  // Purple scale (commonly used in this app)
  'text-purple-50': 'text-primary-foreground',
  'text-purple-100': 'text-primary-foreground',
  'text-purple-200': 'text-primary-variant',
  'text-purple-300': 'text-primary-variant',
  'text-purple-400': 'text-primary-variant',
  'text-purple-500': 'text-primary',
  'text-[#CEA358]': 'text-primary',
  'text-purple-700': 'text-primary',
  'text-purple-800': 'text-primary',
  'text-purple-900': 'text-primary',
  'bg-purple-50': 'bg-primary-soft',
  'bg-purple-100': 'bg-primary-soft',
  'bg-purple-500': 'bg-primary',
  'bg-[#CEA358]': 'bg-primary',
  'bg-purple-700': 'bg-primary',
  
  // Blue scale
  'text-blue-50': 'text-info-foreground',
  'text-blue-100': 'text-info-foreground',
  'text-blue-500': 'text-info',
  'text-blue-600': 'text-info',
  'text-blue-700': 'text-info',
  'bg-blue-50': 'bg-info-soft',
  'bg-blue-100': 'bg-info-soft',
  'bg-blue-500': 'bg-info',
  'bg-blue-600': 'bg-info',
  
  // Green scale
  'text-green-500': 'text-success',
  'text-green-600': 'text-success',
  'text-green-700': 'text-success',
  'bg-green-50': 'bg-success-soft',
  'bg-green-100': 'bg-success-soft',
  'bg-green-500': 'bg-success',
  'bg-green-600': 'bg-success',
  
  // Red scale
  'text-[#8A1503]': 'text-destructive',
  'text-red-600': 'text-destructive',
  'text-[#8A1503]': 'text-destructive',
  'bg-red-50': 'bg-destructive-soft',
  'bg-red-100': 'bg-destructive-soft',
  'bg-[#8A1503]': 'bg-destructive',
  'bg-red-600': 'bg-destructive',
  
  // Warning scale (updated to burnt orange mapping)
  'text-yellow-500': 'text-warning',
  'text-yellow-600': 'text-warning',
  'text-yellow-700': 'text-warning',
  'text-amber-500': 'text-warning',
  'text-amber-600': 'text-warning',
  'text-amber-700': 'text-warning',
  'text-[#8A1503]': 'text-warning',
  'text-orange-600': 'text-warning',
  'bg-yellow-50': 'bg-warning-soft',
  'bg-yellow-100': 'bg-warning-soft',
  'bg-yellow-500': 'bg-warning',
  'bg-yellow-600': 'bg-warning',
  'bg-amber-50': 'bg-warning-soft',
  'bg-amber-100': 'bg-warning-soft',
  'bg-amber-500': 'bg-warning',
  'bg-amber-600': 'bg-warning',
  'bg-orange-50': 'bg-warning-soft',
  'bg-orange-100': 'bg-warning-soft',
  'bg-[#8A1503]': 'bg-warning',
  'bg-orange-600': 'bg-warning',
  
  // Gray scale mappings
  'text-gray-50': 'text-muted-foreground',
  'text-gray-100': 'text-muted-foreground',
  'text-gray-200': 'text-muted-foreground',
  'text-gray-300': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-600': 'text-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'text-gray-900': 'text-foreground',
  'bg-gray-50': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  'bg-white': 'bg-background',
  'bg-black': 'bg-foreground',
  
  // Border colors
  'border-gray-200': 'border-border',
  'border-gray-300': 'border-border',
  'border-purple-200': 'border-primary',
  'border-blue-200': 'border-info',
  'border-green-200': 'border-success',
  'border-red-200': 'border-destructive',
  'border-yellow-200': 'border-warning',
  'border-amber-200': 'border-warning',
  'border-orange-200': 'border-warning',
};

export const spacingTokenMap = {
  // Hardcoded spacing to professional tokens
  'p-1': 'p-professional-xs',
  'p-2': 'p-professional-xs',
  'p-3': 'p-professional-sm',
  'p-4': 'p-professional-sm',
  'p-6': 'p-professional-md',
  'p-8': 'p-professional-lg',
  'p-12': 'p-professional-xl',
  'm-1': 'm-professional-xs',
  'm-2': 'm-professional-xs',
  'm-3': 'm-professional-sm',
  'm-4': 'm-professional-sm',
  'm-6': 'm-professional-md',
  'm-8': 'm-professional-lg',
  'm-12': 'm-professional-xl',
  // Gap mappings
  'gap-1': 'gap-professional-xs',
  'gap-2': 'gap-professional-xs',
  'gap-3': 'gap-professional-sm',
  'gap-4': 'gap-professional-sm',
  'gap-6': 'gap-professional-md',
  'gap-8': 'gap-professional-lg',
};

export const shadowTokenMap = {
  'shadow-sm': 'shadow-professional-soft',
  'shadow': 'shadow-professional',
  'shadow-md': 'shadow-professional-medium',
  'shadow-lg': 'shadow-professional-elevated',
  'shadow-xl': 'shadow-professional-premium',
};

export const gradientTokenMap = {
  'bg-gradient-to-r from-[#CEA358] to-indigo-600': 'bg-gradient-primary',
  'bg-gradient-to-r from-purple-500 to-blue-500': 'bg-gradient-primary',
  'bg-gradient-to-br from-purple-50 to-indigo-50': 'card-gradient-primary',
  'bg-gradient-to-r from-green-500 to-emerald-500': 'bg-gradient-success',
  'bg-gradient-to-r from-blue-500 to-cyan-500': 'bg-gradient-info',
  'bg-gradient-to-r from-yellow-500 to-[#8A1503]': 'bg-gradient-warning',
};

// Audit functions
export const auditClassNames = (className: string): string[] => {
  const violations: string[] = [];
  const classes = className.split(' ');
  
  classes.forEach(cls => {
    // Check for hardcoded colors
    if (cls.includes('gray-') || cls.includes('blue-') || cls.includes('green-') || 
        cls.includes('red-') || cls.includes('yellow-') || cls.includes('amber-') ||
        cls.includes('orange-') || cls.includes('purple-') ||
        cls.includes('pink-') || cls.includes('indigo-')) {
      if (!colorTokenMap[cls]) {
        violations.push(`Hardcoded color: ${cls}`);
      }
    }
    
    // Check for non-professional spacing
    if ((cls.startsWith('p-') || cls.startsWith('m-') || cls.startsWith('gap-')) && 
        !cls.includes('professional') && !spacingTokenMap[cls]) {
      violations.push(`Non-token spacing: ${cls}`);
    }
    
    // Check for hardcoded shadows
    if (cls.startsWith('shadow-') && !cls.includes('professional') && !shadowTokenMap[cls]) {
      violations.push(`Non-token shadow: ${cls}`);
    }
    
    // Check for hardcoded gradients
    if (cls.includes('gradient') && !cls.includes('bg-gradient-primary') && 
        !cls.includes('bg-gradient-accent') && !cls.includes('card-gradient')) {
      violations.push(`Non-token gradient: ${cls}`);
    }
  });
  
  return violations;
};

export const getTokenReplacement = (className: string): string => {
  return colorTokenMap[className] || spacingTokenMap[className] || 
         shadowTokenMap[className] || gradientTokenMap[className] || className;
};

// Design system validation utilities
export const validateDesignSystemUsage = (componentName: string, violations: string[]): void => {
  if (violations.length > 0) {
    console.warn(`🎨 Design System Violations in ${componentName}:`, violations);
    console.warn(`💡 Consider using design tokens instead of hardcoded values.`);
  }
};

// Development mode audit function
export const auditComponent = (componentName: string, element: HTMLElement): void => {
  if (process.env.NODE_ENV === 'development') {
    const className = element.className;
    const violations = auditClassNames(className);
    
    if (violations.length > 0) {
      validateDesignSystemUsage(componentName, violations);
      
      // Add visual indicator in dev mode
      element.style.outline = '2px dashed orange';
      element.title = `Design System Violations: ${violations.join(', ')}`;
    }
  }
};

// Comprehensive audit report generator
export const generateAuditReport = (): void => {
  if (process.env.NODE_ENV === 'development') {
    const allElements = document.querySelectorAll('[class]');
    const globalViolations: { element: Element; violations: string[] }[] = [];
    
    allElements.forEach(element => {
      const violations = auditClassNames(element.className);
      if (violations.length > 0) {
        globalViolations.push({ element, violations });
      }
    });
    
    if (globalViolations.length > 0) {
      console.group('🔍 Design System Audit Report');
      console.warn(`Found ${globalViolations.length} elements with design system violations:`);
      
      globalViolations.forEach(({ element, violations }, index) => {
        console.group(`${index + 1}. ${element.tagName} element`);
        console.log('Element:', element);
        console.log('Violations:', violations);
        console.log('Suggestions:', violations.map(v => {
          const className = v.split(': ')[1];
          return `Replace "${className}" with "${getTokenReplacement(className)}"`;
        }));
        console.groupEnd();
      });
      
      console.groupEnd();
    } else {
      console.log('✅ No design system violations found!');
    }
  }
};

// Auto-fix utility (for development)
export const autoFixElement = (element: HTMLElement): void => {
  if (process.env.NODE_ENV === 'development') {
    const classes = element.className.split(' ');
    const fixedClasses = classes.map(cls => getTokenReplacement(cls));
    
    if (fixedClasses.join(' ') !== element.className) {
      console.log(`🔧 Auto-fixing classes on ${element.tagName}:`);
      console.log(`Before: ${element.className}`);
      console.log(`After: ${fixedClasses.join(' ')}`);
      element.className = fixedClasses.join(' ');
    }
  }
};
