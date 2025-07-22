import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import PageHeader from "@/components/layout/PageHeader";
import { 
  Calendar, 
  Plus, 
  Sparkles, 
  Clock, 
  Users, 
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { scheduleEvents, horses } from "@/data/mockData";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { cn } from "@/lib/utils";

const Scheduler = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 13 }, (_, i) => `${i + 7}:00`);

  const getEventsForDateTime = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return scheduleEvents.filter(event => 
      event.date === dateStr && event.startTime === time
    );
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-secondary/20 border-secondary text-secondary-foreground';
      case 'vet': return 'bg-destructive/20 border-destructive text-destructive-foreground';
      case 'farrier': return 'bg-warning/20 border-warning text-warning-foreground';
      case 'feeding': return 'bg-success/20 border-success text-success-foreground';
      case 'exercise': return 'bg-primary/20 border-primary text-primary-foreground';
      case 'grooming': return 'bg-accent/20 border-accent text-accent-foreground';
      default: return 'bg-muted/20 border-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-meadow">
      <Navigation />
      
      <div className="lg:pl-72">
        <PageHeader 
          title="Barn Scheduler" 
          subtitle="Drag and drop to organize your barn activities"
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="barn" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Auto-Schedule
              </Button>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </div>
          }
        />

        <div className="p-4 lg:p-8 space-y-6">
          {/* Week Navigation */}
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-foreground">
                      {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
                    </h2>
                    <p className="text-sm text-muted-foreground">Week Overview</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">Today</Button>
                  <Button variant="ghost" size="sm">Month View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">8</div>
                <div className="text-sm text-muted-foreground">Lessons</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">6</div>
                <div className="text-sm text-muted-foreground">Care Tasks</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">3</div>
                <div className="text-sm text-muted-foreground">Conflicts</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions */}
          <Card className="bg-gradient-sunset/5 border-accent/20 shadow-barn">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI Scheduling Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Optimize Lesson Times</h4>
                    <p className="text-sm text-muted-foreground">Move Sarah's lesson to 10 AM for better horse availability</p>
                  </div>
                  <Button variant="sunset" size="sm">Apply</Button>
                </div>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Schedule Farrier Visit</h4>
                    <p className="text-sm text-muted-foreground">Bella is due for hoof care - suggested: Thursday 11 AM</p>
                  </div>
                  <Button variant="meadow" size="sm">Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Calendar */}
          <Card className="bg-gradient-card shadow-barn">
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-8 border-b border-border">
                    <div className="p-4 bg-muted/30 font-medium text-center">Time</div>
                    {weekDays.map((day) => (
                      <div key={day.toISOString()} className="p-4 bg-muted/30 text-center">
                        <div className="font-medium text-foreground">{format(day, 'EEE')}</div>
                        <div className="text-sm text-muted-foreground">{format(day, 'MMM d')}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Time Slots */}
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-8 border-b border-border/50">
                      <div className="p-4 bg-muted/10 text-center font-medium text-muted-foreground">
                        {time}
                      </div>
                      {weekDays.map((day) => {
                        const events = getEventsForDateTime(day, time);
                        return (
                          <div key={`${day.toISOString()}-${time}`} className="p-2 min-h-[60px] border-r border-border/30">
                            {events.map((event) => (
                              <div
                                key={event.id}
                                className={cn(
                                  "p-2 rounded text-xs font-medium border cursor-pointer transition-barn hover:scale-105",
                                  getEventColor(event.type)
                                )}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                {event.horseId && (
                                  <div className="opacity-75 truncate">
                                    {horses.find(h => h.id === event.horseId)?.name}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Types Legend */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { type: 'lesson', label: 'Lessons' },
                  { type: 'vet', label: 'Veterinary' },
                  { type: 'farrier', label: 'Farrier' },
                  { type: 'feeding', label: 'Feeding' },
                  { type: 'exercise', label: 'Exercise' },
                  { type: 'grooming', label: 'Grooming' }
                ].map(({ type, label }) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded border", getEventColor(type))} />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;