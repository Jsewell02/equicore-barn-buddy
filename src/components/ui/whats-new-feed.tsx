import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, FileText, Heart, Calendar } from "lucide-react";
import { format, subHours, subDays } from "date-fns";

interface ActivityItem {
  id: string;
  type: 'inventory' | 'health' | 'billing' | 'schedule';
  title: string;
  description: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'inventory':
      return <Package className="w-4 h-4" />;
    case 'health':
      return <Heart className="w-4 h-4" />;
    case 'billing':
      return <FileText className="w-4 h-4" />;
    case 'schedule':
      return <Calendar className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'inventory':
      return 'text-warning';
    case 'health':
      return 'text-primary';
    case 'billing':
      return 'text-success';
    case 'schedule':
      return 'text-secondary';
    default:
      return 'text-muted-foreground';
  }
};

export const WhatsNewFeed = () => {
  const now = new Date();
  
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'inventory',
      title: 'Tack Room Stock Update',
      description: '3 new items added to tack room inventory',
      timestamp: subHours(now, 2),
      priority: 'medium'
    },
    {
      id: '2',
      type: 'health',
      title: 'Health Log Updated',
      description: "Storm's health log updated with farrier visit",
      timestamp: subHours(now, 4),
      priority: 'low'
    },
    {
      id: '3',
      type: 'billing',
      title: 'Payment Received',
      description: 'Mike Rodriguez - $1,150 payment processed',
      timestamp: subHours(now, 6),
      priority: 'low'
    },
    {
      id: '4',
      type: 'schedule',
      title: 'New Lesson Scheduled',
      description: 'Bella - Private lesson added for tomorrow',
      timestamp: subDays(now, 1),
      priority: 'medium'
    }
  ];

  return (
    <Card className="bg-gradient-card shadow-barn">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          What's New
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className={`mt-0.5 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </h4>
                {activity.priority && activity.priority !== 'low' && (
                  <Badge 
                    variant={activity.priority === 'high' ? 'destructive' : 'default'}
                    className="ml-2 text-xs"
                  >
                    {activity.priority}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {format(activity.timestamp, 'MMM d, h:mm a')}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};