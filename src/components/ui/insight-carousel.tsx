import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, AlertTriangle, Package, FileText, Calendar } from "lucide-react";
import { useState } from "react";
import { AIInsight } from "@/data/mockData";

interface InsightCarouselProps {
  insights: AIInsight[];
  onInsightAction?: (insight: AIInsight) => void;
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'health':
      return '🐎';
    case 'inventory':
      return '🧼';
    case 'billing':
      return '🧾';
    case 'scheduling':
      return '📅';
    case 'maintenance':
      return '🔧';
    default:
      return '💡';
  }
};

const getInsightAction = (type: string) => {
  switch (type) {
    case 'health':
      return 'Schedule';
    case 'inventory':
      return 'Reorder';
    case 'billing':
      return 'Review';
    case 'scheduling':
      return 'Plan';
    case 'maintenance':
      return 'Maintain';
    default:
      return 'Action';
  }
};

export const InsightCarousel = ({ insights, onInsightAction }: InsightCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextInsight = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.length);
  };
  
  const prevInsight = () => {
    setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
  };

  if (insights.length === 0) return null;

  const currentInsight = insights[currentIndex];

  return (
    <Card className="bg-gradient-sunset shadow-glow border-0 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevInsight}
            className="text-accent-foreground hover:bg-accent-foreground/10"
            disabled={insights.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 text-center px-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">{getInsightIcon(currentInsight.type)}</span>
              <h3 className="text-lg font-semibold text-accent-foreground">
                {currentInsight.title}
              </h3>
              <Badge 
                variant={currentInsight.priority === 'high' || currentInsight.priority === 'urgent' ? 'destructive' : 'secondary'}
                className="ml-2"
              >
                {currentInsight.priority}
              </Badge>
            </div>
            <p className="text-sm text-accent-foreground/80 mb-3">
              {currentInsight.description}
            </p>
            {currentInsight.actionRequired && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onInsightAction?.(currentInsight)}
                className="bg-accent-foreground/10 text-accent-foreground hover:bg-accent-foreground/20"
              >
                {getInsightAction(currentInsight.type)} Now
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextInsight}
            className="text-accent-foreground hover:bg-accent-foreground/10"
            disabled={insights.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        {insights.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {insights.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-accent-foreground' 
                    : 'bg-accent-foreground/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};