import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import PageHeader from "@/components/layout/PageHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { DemoControls } from "@/components/demo/DemoControls";
import { WeatherWidget } from "@/components/ui/weather-widget";
import StatCard from "@/components/ui/stat-card";
import { useDemoContext } from "@/contexts/DemoContext";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp,
  Heart,
  Clock,
  ChevronRight 
} from "lucide-react";
import { getDynamicMockData } from "@/data/dynamicMockData";
import { format } from "date-fns";
import horsesImage from "@/assets/horses-fence.jpg";
import { AIScheduleModal } from "@/components/modals/AIScheduleModal";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { demoState } = useDemoContext();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get dynamic data based on demo state
  const { horses, scheduleEvents, inventory, aiInsights } = getDynamicMockData(demoState);

  // Calculate stats
  const totalHorses = horses.length;
  const healthyHorses = horses.filter(h => h.healthStatus === 'excellent' || h.healthStatus === 'good').length;
  const todayEvents = scheduleEvents.filter(e => e.date === format(new Date(), 'yyyy-MM-dd'));
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const urgentInsights = aiInsights.filter(insight => insight.priority === 'high' || insight.priority === 'urgent');

  const totalRevenue = horses.reduce((sum, horse) => sum + horse.boardingRate, 0);

  return (
    <div className="min-h-screen bg-gradient-meadow">
      <MobileNav />
      <Navigation />
      
      <div className="lg:pl-72">
        <PageHeader 
          title={`${demoState.barnName} Dashboard`} 
          subtitle={`Welcome back! Here's what's happening at ${demoState.barnName} today.`}
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="barn" 
                className="gap-2"
                onClick={() => setShowAIModal(true)}
              >
                <Sparkles className="w-4 h-4" />
                AI Insights
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => navigate('/scheduler')}
              >
                <Calendar className="w-4 h-4" />
                Quick Schedule
              </Button>
            </div>
          }
        />

        <div className="p-4 lg:p-8 space-y-8">
          {/* Enhanced Weather Widget */}
          <WeatherWidget currentTime={currentTime} />

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Horses"
              value={totalHorses}
              description={`${healthyHorses} healthy horses`}
              icon={<Users className="w-6 h-6 text-primary" />}
              trend={{ value: "2", isPositive: true }}
            />
            <StatCard
              title="Today's Events"
              value={todayEvents.length}
              description="Scheduled activities"
              icon={<Calendar className="w-6 h-6 text-secondary" />}
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              description="Boarding fees"
              icon={<DollarSign className="w-6 h-6 text-success" />}
              trend={{ value: "8.2%", isPositive: true }}
            />
            <StatCard
              title="Inventory Alerts"
              value={lowStockItems.length}
              description="Items need restocking"
              icon={<Package className="w-6 h-6 text-warning" />}
            />
          </div>

          {/* AI Insights & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Insights */}
            <Card className="bg-gradient-card shadow-barn">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI Insights
                  </CardTitle>
                  <Badge variant="secondary">{urgentInsights.length} urgent</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <Badge 
                        variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    {insight.suggestedAction && (
                      <p className="text-sm text-accent font-medium">{insight.suggestedAction}</p>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Insights
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="bg-gradient-card shadow-barn">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayEvents.length > 0 ? (
                  <>
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                        <Badge variant={event.priority === 'high' ? 'destructive' : 'secondary'}>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm">
                      View Full Schedule
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No events scheduled for today</p>
                    <Button variant="barn" size="sm" className="mt-3">
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Horses Overview */}
          <Card className="bg-gradient-card shadow-barn">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Horses Overview
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All Horses
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {horses.map((horse) => (
                  <div key={horse.id} className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:shadow-card transition-barn">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{horse.name}</h4>
                      <Badge 
                        variant={
                          horse.healthStatus === 'excellent' ? 'default' :
                          horse.healthStatus === 'good' ? 'secondary' :
                          horse.healthStatus === 'needs-attention' ? 'destructive' : 'destructive'
                        }
                      >
                        {horse.healthStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{horse.breed} • {horse.age} years</p>
                    <p className="text-sm text-muted-foreground">Owner: {horse.owner}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Beautiful Hero Section */}
          <Card className="overflow-hidden bg-gradient-sunset shadow-glow">
            <div className="relative">
              <img 
                src={horsesImage} 
                alt="Horses at the barn" 
                className="w-full h-64 md:h-48 object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-sunset/80 flex items-center justify-center">
                <div className="text-center text-accent-foreground">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    Powered by AI, Built for Barns
                  </h3>
                  <p className="text-lg mb-4 opacity-90">
                    Experience the future of barn management with EquiCore
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="secondary" size="lg" className="gap-2">
                      <TrendingUp className="w-5 h-5" />
                      View Analytics
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                      <Sparkles className="w-5 h-5" />
                      AI Features
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <DemoControls />
      
      <AIScheduleModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </div>
  );
};

export default Index;
