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
import { HorseRosterPanel } from "@/components/ui/horse-roster-panel";
import { RevenueBreakdown } from "@/components/ui/revenue-breakdown";
import { WhatsNewFeed } from "@/components/ui/whats-new-feed";
import { InsightCarousel } from "@/components/ui/insight-carousel";
import { DemoTooltip } from "@/components/ui/demo-tooltip";
import { useDemoContext } from "@/contexts/DemoContext";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { WalkthroughOverlay } from "@/components/walkthrough/WalkthroughOverlay";
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
  ChevronRight,
  Stethoscope,
  CheckCircle,
  AlertCircle,
  Wand2
} from "lucide-react";
import { getDynamicMockData } from "@/data/dynamicMockData";
import { format } from "date-fns";
import horsesImage from "@/assets/horses-fence.jpg";
import { AIScheduleModal } from "@/components/modals/AIScheduleModal";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  console.log('Index component loading'); // Debug log
  const { demoState } = useDemoContext();
  console.log('About to call useWalkthrough'); // Debug log
  const { startWalkthrough } = useWalkthrough();
  console.log('useWalkthrough called successfully'); // Debug log
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

  const handleInsightAction = (insight: any) => {
    toast({
      title: "Action Scheduled",
      description: `${insight.suggestedAction} has been added to your tasks.`,
    });
  };

  const getUrgencyStatus = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          label: "Overdue",
          variant: "destructive" as const,
          color: "text-destructive"
        };
      case 'medium':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: "Scheduled",
          variant: "default" as const,
          color: "text-secondary"
        };
      case 'low':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Handled",
          variant: "secondary" as const,
          color: "text-success"
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          label: "Pending",
          variant: "secondary" as const,
          color: "text-muted-foreground"
        };
    }
  };

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

        <div className="p-4 lg:p-8 space-y-10">
          {/* AI Insight Carousel */}
          <InsightCarousel insights={urgentInsights} onInsightAction={handleInsightAction} />

          {/* Enhanced Weather Widget */}
          <WeatherWidget currentTime={currentTime} />

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <DemoTooltip content="Click to view detailed horse records and health status">
              <StatCard
                title="Total Horses"
                value={totalHorses}
                description={`${healthyHorses} healthy horses`}
                icon={<Users className="w-6 h-6 text-primary" />}
                trend={{ value: "2", isPositive: true }}
                className="hover:shadow-barn cursor-pointer transition-barn"
              />
            </DemoTooltip>
            <DemoTooltip content="Tap here to schedule farrier visits">
              <StatCard
                title="Today's Events"
                value={todayEvents.length}
                description="Scheduled activities"
                icon={<Calendar className="w-6 h-6 text-secondary" />}
                className="hover:shadow-barn cursor-pointer transition-barn"
              />
            </DemoTooltip>
            <StatCard
              title="Monthly Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              description="Boarding, lessons & training"
              icon={<DollarSign className="w-6 h-6 text-success" />}
              trend={{ value: "8.2%", isPositive: true }}
              className="hover:shadow-barn cursor-pointer transition-barn"
            />
            <StatCard
              title="Tack Room Stock"
              value={lowStockItems.length}
              description="Items need restocking"
              icon={<Package className="w-6 h-6 text-warning" />}
              className="hover:shadow-barn cursor-pointer transition-barn"
            />
          </div>

          {/* Enhanced Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced AI Insights */}
            <Card className="bg-gradient-card shadow-barn lg:col-span-2">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI Insights & Recommendations
                  </CardTitle>
                  <Badge variant="secondary">{urgentInsights.length} urgent</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {aiInsights.slice(0, 3).map((insight) => {
                  const status = getUrgencyStatus(insight.priority);
                  return (
                    <div key={insight.id} className="p-5 bg-muted/50 rounded-lg border border-border/50 hover:shadow-card transition-barn">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{insight.title}</h4>
                          <div className={`flex items-center gap-1 ${status.color}`}>
                            {status.icon}
                            <span className="text-xs font-medium">{status.label}</span>
                          </div>
                        </div>
                        <Badge variant={status.variant} className="ml-2">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      {insight.suggestedAction && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-accent font-medium">{insight.suggestedAction}</p>
                          {insight.actionRequired && (
                            <DemoTooltip content="Click to view Bella's health history">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleInsightAction(insight)}
                                className="ml-3"
                              >
                                Take Action
                              </Button>
                            </DemoTooltip>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => setShowAIModal(true)}
                >
                  View All Insights
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* What's New Feed */}
            <WhatsNewFeed />
          </div>

          {/* Secondary Grid - Horse Roster, Revenue, Today's Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Horse Roster Panel */}
            <HorseRosterPanel horses={horses} />
            
            {/* Revenue Breakdown */}
            <RevenueBreakdown totalRevenue={totalRevenue} />
            
            {/* Today's Schedule */}
            <Card className="bg-gradient-card shadow-barn">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayEvents.length > 0 ? (
                  <>
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
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
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="sm"
                      onClick={() => navigate('/scheduler')}
                    >
                      View Full Schedule
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No events scheduled for today</p>
                    <Button 
                      variant="barn" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => navigate('/scheduler')}
                    >
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Beautiful Hero Section */}
          <Card className="overflow-hidden bg-gradient-sunset shadow-glow">
            <div className="relative">
              <img 
                src={horsesImage} 
                alt="Horses at the barn" 
                className="w-full h-64 md:h-48 object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-sunset/80 flex items-center justify-center">
                <div className="text-center text-accent-foreground px-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    Powered by AI, Built for Barns
                  </h3>
                  <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                    Experience the future of barn management with EquiCore – where traditional horsemanship meets cutting-edge technology
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="gap-2"
                      onClick={() => navigate('/billing')}
                    >
                      <TrendingUp className="w-5 h-5" />
                      View Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="gap-2 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/20"
                      onClick={startWalkthrough}
                    >
                      <Wand2 className="w-5 h-5" />
                      Start Demo Tour
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
      <WalkthroughOverlay />
    </div>
  );
};

export default Index;
