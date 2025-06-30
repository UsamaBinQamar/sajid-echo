
import { useEffect, useRef } from 'react';
import { auditComponent, validateDesignSystemUsage, auditClassNames } from '@/utils/designSystemAudit';

interface UseDesignSystemAuditOptions {
  componentName: string;
  enabled?: boolean;
  autoFix?: boolean;
}

export const useDesignSystemAudit = ({ 
  componentName, 
  enabled = process.env.NODE_ENV === 'development',
  autoFix = false 
}: UseDesignSystemAuditOptions) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    
    // Audit the component
    auditComponent(componentName, element);
    
    // Auto-fix if enabled
    if (autoFix) {
      const { autoFixElement } = require('@/utils/designSystemAudit');
      autoFixElement(element);
    }
  }, [componentName, enabled, autoFix]);

  // Utility function to manually audit a className
  const auditClassName = (className: string) => {
    if (!enabled) return [];
    
    const violations = auditClassNames(className);
    if (violations.length > 0) {
      validateDesignSystemUsage(componentName, violations);
    }
    return violations;
  };

  return {
    elementRef,
    auditClassName
  };
};
