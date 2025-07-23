import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings, Palette, Database, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDemoContext } from "@/contexts/DemoContext";

export function DemoControls() {
  const { demoState, updateDemoState } = useDemoContext();
  const [barnName, setBarnName] = useState(demoState.barnName);
  const [ownerName, setOwnerName] = useState(demoState.ownerName);
  const [primaryHorse, setPrimaryHorse] = useState(demoState.primaryHorse);
  const { toast } = useToast();

  const handleUpdateDemo = () => {
    updateDemoState({
      barnName,
      ownerName,
      primaryHorse,
    });
    toast({
      title: "Demo Updated",
      description: `${barnName} demo customized - ready for your pitch!`,
    });
  };

  const quickPresets = [
    { name: "Sunset Stables", horse: "Bella", theme: "Warm" },
    { name: "Valley View Farm", horse: "Thunder", theme: "Professional" },
    { name: "Meadow Ridge Barn", horse: "Moonlight", theme: "Classic" },
    { name: "Oakwood Equestrian", horse: "Storm", theme: "Modern" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-6 right-4 z-40 bg-background/90 backdrop-blur-sm border shadow-barn lg:bottom-4 lg:z-50"
        >
          <Settings className="w-4 h-4 mr-1" />
          Demo Setup
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Customize Demo
          </SheetTitle>
          <SheetDescription>
            Personalize the demo for your pitch meeting.
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Presets</Label>
            <div className="grid grid-cols-1 gap-2">
              {quickPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3"
                  onClick={() => {
                    setBarnName(preset.name);
                    setPrimaryHorse(preset.horse);
                    updateDemoState({
                      barnName: preset.name,
                      primaryHorse: preset.horse,
                      theme: preset.theme,
                    });
                    toast({
                      title: "Preset Applied",
                      description: `${preset.name} demo ready for your pitch!`,
                    });
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Featured: {preset.horse} • {preset.theme}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Custom Settings</Label>
            
            <div className="space-y-2">
              <Label htmlFor="barnName">Barn Name</Label>
              <Input
                id="barnName"
                value={barnName}
                onChange={(e) => setBarnName(e.target.value)}
                placeholder="Enter barn name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner/Manager</Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primaryHorse">Featured Horse</Label>
              <select
                id="primaryHorse"
                value={primaryHorse}
                onChange={(e) => setPrimaryHorse(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="Bella">Bella (Quarter Horse)</option>
                <option value="Thunder">Thunder (Thoroughbred)</option>
                <option value="Moonlight">Moonlight (Arabian)</option>
                <option value="Storm">Storm (Paint Horse)</option>
              </select>
            </div>
            
            <Button onClick={handleUpdateDemo} className="w-full" variant="barn">
              Update Demo
            </Button>
          </div>

          {/* Demo Features */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4" />
                Demo Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Interactive Scheduling</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">AI Suggestions</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Live Data Updates</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Mobile Optimized</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-foreground">Pitch Tips</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Start with the Dashboard overview</li>
              <li>• Show AI scheduling in action</li>
              <li>• Demonstrate mobile responsiveness</li>
              <li>• Highlight cost savings potential</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}