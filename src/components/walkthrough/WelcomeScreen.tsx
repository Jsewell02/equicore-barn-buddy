import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { Heart, Sparkles } from "lucide-react";

export const WelcomeScreen = () => {
  const { nextStep, skipWalkthrough } = useWalkthrough();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center bg-card border-border shadow-2xl">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to EquiCore
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Your barn's smart dashboard
          </p>
          <p className="text-muted-foreground">
            We'll walk you through the core features in under 90 seconds — then let you explore on your own.
          </p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Interactive Demo Experience</span>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={nextStep}
            className="w-full"
            size="lg"
          >
            Start Walkthrough
          </Button>
          <Button 
            variant="ghost" 
            onClick={skipWalkthrough}
            className="w-full text-sm"
          >
            Skip to Demo
          </Button>
        </div>
      </Card>
    </div>
  );
};