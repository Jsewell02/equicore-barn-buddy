import { Horse } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HorseRosterPanelProps {
  horses: Horse[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent':
      return 'bg-success text-success-foreground';
    case 'good': 
      return 'bg-secondary text-secondary-foreground';
    case 'needs-attention':
      return 'bg-warning text-warning-foreground';
    case 'critical':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getHorseEmoji = (breed: string) => {
  const emojiMap: { [key: string]: string } = {
    'Quarter Horse': '🐎',
    'Thoroughbred': '🏇',
    'Arabian': '🦄',
    'Paint Horse': '🎨',
    'Warmblood': '⚡',
    'Clydesdale': '💪',
    'Mustang': '🌪️'
  };
  return emojiMap[breed] || '🐴';
};

export const HorseRosterPanel = ({ horses }: HorseRosterPanelProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-card shadow-barn">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Horse Roster
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {horses.map((horse) => (
          <div 
            key={horse.id} 
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:shadow-card transition-barn cursor-pointer"
            onClick={() => navigate('/horses')}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getHorseEmoji(horse.breed)}</span>
              <div>
                <div className="font-medium text-foreground">{horse.name}</div>
                <div className="text-sm text-muted-foreground">{horse.breed}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(horse.healthStatus)}`} />
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        ))}
        <Button 
          variant="outline" 
          className="w-full" 
          size="sm"
          onClick={() => navigate('/horses')}
        >
          View All Records
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};