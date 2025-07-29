import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { MousePointer, Unlock } from "lucide-react";

export const TransitionScreen = () => {
  const { enterInteractiveMode } = useWalkthrough();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center bg-card border-border shadow-2xl">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500/10 p-3 rounded-full">
              <Unlock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Explore!
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Now it's your turn — explore EquiCore's features with real barn data.
          </p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <MousePointer className="w-5 h-5 text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Full Interactive Experience Unlocked</span>
        </div>

        <Button 
          onClick={enterInteractiveMode}
          className="w-full"
          size="lg"
        >
          Enter Demo Mode
        </Button>
      </Card>
    </div>
  );
};