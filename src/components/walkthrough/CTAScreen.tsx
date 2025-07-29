import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { Calendar, Mail, Phone, X } from "lucide-react";

export const CTAScreen = () => {
  const { enterInteractiveMode } = useWalkthrough();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center bg-card border-border shadow-2xl relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={enterInteractiveMode}
          className="absolute top-4 right-4 p-2"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to bring EquiCore to your barn?
          </h2>
          <p className="text-muted-foreground">
            Join progressive barn owners who are revolutionizing their operations with AI-powered management.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <Button 
            className="w-full"
            size="lg"
            onClick={() => window.open('mailto:hello@equicore.ai?subject=Book Free Pilot', '_blank')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Free Pilot
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => window.open('https://calendly.com/equicore', '_blank')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Schedule Live Walkthrough
          </Button>
          
          <Button 
            variant="ghost"
            className="w-full"
            onClick={() => window.open('mailto:team@equicore.ai', '_blank')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact the Team
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          No commitment required • Setup in under 30 minutes
        </p>
      </Card>
    </div>
  );
};