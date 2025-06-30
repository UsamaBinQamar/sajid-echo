
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Zap, Eye } from 'lucide-react';
import { generateAuditReport, auditClassNames, getTokenReplacement } from '@/utils/designSystemAudit';

interface ViolationReport {
  element: Element;
  violations: string[];
  suggestions: string[];
}

export const DesignSystemAuditPanel = () => {
  const [violations, setViolations] = useState<ViolationReport[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState(false);

  const runAudit = () => {
    const allElements = document.querySelectorAll('[class]');
    const foundViolations: ViolationReport[] = [];
    
    allElements.forEach(element => {
      const elementViolations = auditClassNames(element.className);
      if (elementViolations.length > 0) {
        const suggestions = elementViolations.map(violation => {
          const className = violation.split(': ')[1];
          return `Replace "${className}" with "${getTokenReplacement(className)}"`;
        });
        
        foundViolations.push({
          element,
          violations: elementViolations,
          suggestions
        });
      }
    });
    
    setViolations(foundViolations);
    
    // Auto-highlight violations if enabled
    if (autoHighlight) {
      foundViolations.forEach(({ element }) => {
        (element as HTMLElement).style.outline = '2px dashed hsl(var(--warning))';
        (element as HTMLElement).style.outlineOffset = '2px';
      });
    }
  };

  const clearHighlights = () => {
    const allElements = document.querySelectorAll('[style*="outline"]');
    allElements.forEach(element => {
      (element as HTMLElement).style.outline = '';
      (element as HTMLElement).style.outlineOffset = '';
    });
  };

  const highlightElement = (element: Element) => {
    clearHighlights();
    (element as HTMLElement).style.outline = '3px solid hsl(var(--destructive))';
    (element as HTMLElement).style.outlineOffset = '2px';
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (isVisible) {
      runAudit();
    }
    
    return () => {
      if (!isVisible) {
        clearHighlights();
      }
    };
  }, [isVisible, autoHighlight]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-warning text-warning-foreground shadow-professional-elevated"
        size="sm"
      >
        <Eye className="h-4 w-4 mr-2" />
        Design Audit
        {violations.length > 0 && (
          <Badge variant="destructive" className="ml-2">
            {violations.length}
          </Badge>
        )}
      </Button>

      {/* Audit Panel */}
      {isVisible && (
        <Card className="fixed bottom-16 right-4 w-96 max-h-[60vh] z-50 shadow-professional-premium overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                Design System Audit
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs defaultValue="violations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
                <TabsTrigger value="violations" className="text-xs">
                  Violations ({violations.length})
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-xs">
                  Actions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="violations" className="max-h-80 overflow-y-auto px-4 pb-4">
                {violations.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No design system violations found!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {violations.map((violation, index) => (
                      <Card key={index} className="p-3 cursor-pointer hover:bg-muted" 
                            onClick={() => highlightElement(violation.element)}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="destructive" className="text-xs">
                              {violation.element.tagName.toLowerCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {violation.violations.length} issues
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            {violation.violations.map((v, vIndex) => (
                              <div key={vIndex} className="text-xs">
                                <span className="text-destructive font-mono">{v}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-1">
                            {violation.suggestions.map((suggestion, sIndex) => (
                              <div key={sIndex} className="text-xs text-success">
                                💡 {suggestion}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="actions" className="px-4 pb-4 space-y-3">
                <Button
                  onClick={runAudit}
                  className="w-full"
                  size="sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Run Audit
                </Button>
                
                <Button
                  onClick={() => {
                    setAutoHighlight(!autoHighlight);
                    if (!autoHighlight) runAudit();
                    else clearHighlights();
                  }}
                  variant={autoHighlight ? "destructive" : "outline"}
                  className="w-full"
                  size="sm"
                >
                  {autoHighlight ? 'Disable' : 'Enable'} Auto-Highlight
                </Button>
                
                <Button
                  onClick={clearHighlights}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Clear Highlights
                </Button>
                
                <Button
                  onClick={() => {
                    generateAuditReport();
                    console.log('📊 Full audit report generated in console');
                  }}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Console Report
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  );
};
