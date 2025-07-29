import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { WelcomeScreen } from "./WelcomeScreen";
import { TransitionScreen } from "./TransitionScreen";
import { CTAScreen } from "./CTAScreen";
import { WalkthroughStep } from "./WalkthroughStep";
import { Button } from "@/components/ui/button";
import { RotateCcw, MessageSquare } from "lucide-react";

export const WalkthroughOverlay = () => {
  const { state, restartWalkthrough, showCTA } = useWalkthrough();

  if (!state.isActive && state.currentStep !== 'cta') return null;

  return (
    <>
      {state.currentStep === 'welcome' && <WelcomeScreen />}
      {state.currentStep === 'transition' && <TransitionScreen />}
      {state.currentStep === 'cta' && <CTAScreen />}
      
      <WalkthroughStep
        step="horses"
        title="Horse Profiles"
        description="View all your horses in one place — with instant access to health logs, farrier/vet records, and notes."
        targetSelector="nav a[href='/horses']"
        position="bottom"
      />
      
      <WalkthroughStep
        step="scheduler"
        title="Scheduling Dashboard"
        description="Manage farrier visits, vet appointments, and turnout schedules in one central calendar."
        targetSelector="nav a[href='/scheduler']"
        position="bottom"
      />
      
      <WalkthroughStep
        step="inventory"
        title="Supply Tracker"
        description="Track inventory for feed, bedding, meds — and set smart alerts when stock runs low."
        targetSelector="nav a[href='/inventory']"
        position="bottom"
      />
      
      <WalkthroughStep
        step="billing"
        title="Billing Dashboard"
        description="Automatically generate invoices per horse or boarder — with built-in rate logic and PDF export."
        targetSelector="nav a[href='/billing']"
        position="bottom"
      />
      
      <WalkthroughStep
        step="tasks"
        title="Feed + Task Log"
        description="Log daily feedings, medications, and staff tasks — so nothing slips through the cracks."
        targetSelector="[data-walkthrough='daily-tasks']"
        position="top"
      />

      {/* Floating controls for interactive mode */}
      {state.currentStep === 'interactive' && state.hasCompleted && (
        <div className="fixed bottom-4 right-4 z-30 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={restartWalkthrough}
            className="bg-card/80 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Replay Tour
          </Button>
          <Button
            size="sm"
            onClick={showCTA}
            className="bg-primary text-primary-foreground"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      )}
    </>
  );
};