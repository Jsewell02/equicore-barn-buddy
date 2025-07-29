import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWalkthrough, WalkthroughStep as StepType } from "@/contexts/WalkthroughContext";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

interface WalkthroughStepProps {
  step: StepType;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const WalkthroughStep = ({ step, title, description, targetSelector, position = 'center' }: WalkthroughStepProps) => {
  const { state, nextStep, skipWalkthrough, restartWalkthrough } = useWalkthrough();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (targetSelector) {
      const element = document.querySelector(targetSelector) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.position = 'relative';
        element.style.zIndex = '45';
        element.style.outline = '3px solid hsl(var(--primary))';
        element.style.outlineOffset = '4px';
        element.style.borderRadius = '8px';
      }
    }

    // Auto-advance after 4 seconds
    const timer = setTimeout(() => {
      nextStep();
    }, 4000);
    setAutoAdvanceTimer(timer);

    return () => {
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.outline = '';
        targetElement.style.outlineOffset = '';
        targetElement.style.borderRadius = '';
      }
      if (timer) clearTimeout(timer);
    };
  }, [targetSelector, targetElement, nextStep]);

  const handleNext = () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
    }
    nextStep();
  };

  if (state.currentStep !== step) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'left':
        return 'left-4 top-1/2 -translate-y-1/2';
      case 'right':
        return 'right-4 top-1/2 -translate-y-1/2';
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40">
      <Card className={`fixed ${getPositionClasses()} max-w-sm p-6 bg-card border-border shadow-2xl`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={restartWalkthrough}
              className="p-1 h-8 w-8"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipWalkthrough}
              className="p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Auto-advancing in 4s
          </div>
          <Button onClick={handleNext} size="sm">
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
};