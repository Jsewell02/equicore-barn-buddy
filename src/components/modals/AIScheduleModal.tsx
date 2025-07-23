import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Clock, Users, Activity } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface AIScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScheduleSuggestion {
  id: string;
  type: 'lesson' | 'vet' | 'farrier' | 'exercise' | 'feeding';
  title: string;
  suggestedTime: string;
  suggestedDate: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  horse?: string;
  conflicts?: string[];
}

const mockSuggestions: ScheduleSuggestion[] = [
  {
    id: '1',
    type: 'farrier',
    title: 'Farrier Visit - Bella',
    suggestedTime: '11:00 AM',
    suggestedDate: '2024-07-25',
    reason: 'Overdue by 2 weeks, optimal time slot available',
    priority: 'high',
    horse: 'Bella'
  },
  {
    id: '2',
    type: 'lesson',
    title: 'Advanced Lesson - Thunder',
    suggestedTime: '2:00 PM',
    suggestedDate: '2024-07-24',
    reason: 'High-energy horse needs more frequent training',
    priority: 'medium',
    horse: 'Thunder'
  },
  {
    id: '3',
    type: 'vet',
    title: 'Routine Checkup - Moonlight',
    suggestedTime: '10:00 AM',
    suggestedDate: '2024-07-26',
    reason: 'Senior horse health monitoring schedule',
    priority: 'medium',
    horse: 'Moonlight'
  },
  {
    id: '4',
    type: 'exercise',
    title: 'Trail Exercise - Storm',
    suggestedTime: '4:00 PM',
    suggestedDate: '2024-07-24',
    reason: 'Weather forecast optimal, horse available',
    priority: 'low',
    horse: 'Storm'
  }
];

export function AIScheduleModal({ isOpen, onClose }: AIScheduleModalProps) {
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSuggestionToggle = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleApplySelected = () => {
    const appliedCount = selectedSuggestions.length;
    
    toast({
      title: "AI Suggestions Applied",
      description: `${appliedCount} scheduling suggestion${appliedCount !== 1 ? 's' : ''} have been added to your calendar.`,
    });
    
    setSelectedSuggestions([]);
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <Users className="w-4 h-4" />;
      case 'vet': return <Activity className="w-4 h-4" />;
      case 'farrier': return <Activity className="w-4 h-4" />;
      case 'exercise': return <Activity className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            AI Scheduling Recommendations
          </DialogTitle>
          <DialogDescription>
            Based on your barn's patterns, here are intelligent scheduling suggestions to optimize your operations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-medium text-foreground">AI Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your recent activity, horse health records, and optimal scheduling patterns, 
              I've identified {mockSuggestions.length} recommendations to improve your barn operations.
            </p>
          </div>

          <div className="space-y-3">
            {mockSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-barn">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedSuggestions.includes(suggestion.id)}
                    onCheckedChange={() => handleSuggestionToggle(suggestion.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(suggestion.type)}
                        <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                      </div>
                      <Badge variant={getPriorityColor(suggestion.priority) as any}>
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Suggested Date:</span>
                        <div className="font-medium text-foreground">
                          {format(new Date(suggestion.suggestedDate), 'EEE, MMM d')}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Suggested Time:</span>
                        <div className="font-medium text-foreground">{suggestion.suggestedTime}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">AI Reasoning:</span>
                      <p className="text-foreground mt-1">{suggestion.reason}</p>
                    </div>
                    
                    {suggestion.conflicts && suggestion.conflicts.length > 0 && (
                      <div className="text-sm">
                        <span className="text-warning">⚠️ Potential conflicts:</span>
                        <ul className="text-muted-foreground mt-1">
                          {suggestion.conflicts.map((conflict, index) => (
                            <li key={index}>• {conflict}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedSuggestions.length > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm font-medium text-foreground">
                {selectedSuggestions.length} suggestion{selectedSuggestions.length !== 1 ? 's' : ''} selected
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                These events will be automatically added to your schedule with AI-optimized timing.
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button 
            variant="barn" 
            onClick={handleApplySelected}
            disabled={selectedSuggestions.length === 0}
          >
            Apply Selected ({selectedSuggestions.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}