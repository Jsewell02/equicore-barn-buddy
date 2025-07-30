import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import PageHeader from "@/components/layout/PageHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { WeatherWidget } from "@/components/ui/weather-widget";
import StatCard from "@/components/ui/stat-card";
import { HorseRosterPanel } from "@/components/ui/horse-roster-panel";
import { RevenueBreakdown } from "@/components/ui/revenue-breakdown";
import { WhatsNewFeed } from "@/components/ui/whats-new-feed";
import { InsightCarousel } from "@/components/ui/insight-carousel";
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
  Wand2,
  RefreshCw
} from "lucide-react";
import { getDynamicMockData } from "@/data/dynamicMockData";
import { format } from "date-fns";
import horsesImage from "@/assets/horses-fence.jpg";
import { AIScheduleModal } from "@/components/modals/AIScheduleModal";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// UPDATED AIRTABLE INTEGRATION
import getAirtableData from "@/utils/airtable";

// UPDATED AIRTABLE TYPES
interface BarnFields {
  'Barn Name': string;
  'Owner Name': string;
  'Contact Email'?: string;
  'Phone'?: string;
  'Location'?: string;
  'Schedule'?: string;
  'Tasks'?: string;
  'Horses'?: string;
  'Staff'?: string;
}

interface HorseFields {
  'Horse Name': string;
  'Date of Birth'?: string;
  'Breed'?: string;
  'Owner Name'?: string;
  'Barn'?: string;
  'Assigned Staff'?: string;
  'Barn Name'?: string;
  'Assigned Staff Email'?: string;
  'Age'?: number;
  'Health Summary'?: string;
  'Training Recommendations'?: string;
  'Schedule'?: string;
  'Health Logs'?: string;
}

interface AirtableRecord<T = any> {
  id: string;
  fields: T;
  createdTime?: string;
}

const Index = () => {
  console.log('Index component loading');
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAIModal, setShowAIModal] = useState(false);

  // UPDATED AIRTABLE STATE
  const [barnsData, setBarnsData] = useState<AirtableRecord<BarnFields>[]>([]);
  const [horsesData, setHorsesData] = useState<AirtableRecord<HorseFields>[]>([]);
  const [airtableLoading, setAirtableLoading] = useState(true);
  const [airtableError, setAirtableError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // UPDATED AIRTABLE DATA FETCHING - Fetch both tables
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const fetchAllAirtableData = async () => {
      try {
        console.log('🚀 Fetching all Airtable data...');
        setAirtableLoading(true);
        setAirtableError(null);
        
        // Fetch both Barns and Horses tables
        const [barns, horses] = await Promise.all([
          getAirtableData('Barns'),
          getAirtableData('Horses')
        ]);
        
        if (!isMounted) return; // Don't update state if component unmounted
        
        console.log('✅ Barns data received:', barns);
        console.log('✅ Horses data received:', horses);
        
        // Ensure we have arrays and filter out any invalid records
        const validBarns = Array.isArray(barns) ? barns.filter(barn => barn && barn.id && barn.fields) : [];
        const validHorses = Array.isArray(horses) ? horses.filter(horse => horse && horse.id && horse.fields) : [];
        
        setBarnsData(validBarns);
        setHorsesData(validHorses);
        
        // Show success toast
        toast({
          title: "Real Data Loaded",
          description: `Successfully loaded ${validBarns.length} barns and ${validHorses.length} horses from Airtable.`,
        });
      } catch (error) {
        if (!isMounted) return;
        
        console.error('❌ Airtable fetch error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
        setAirtableError(errorMessage);
        
        // Show error toast
        toast({
          title: "Data Loading Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setAirtableLoading(false);
        }
      }
    };

    fetchAllAirtableData();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  // Get mock data for the interface
  const barnName = "Sunset Stables";
  const { horses, scheduleEvents, inventory, aiInsights } = getDynamicMockData({ barnName });

  // ENHANCED STATS CALCULATION - now includes real Airtable data
  const totalMockHorses = horses.length;
  const realHorsesCount = horsesData.length;
  const totalHorses = totalMockHorses + realHorsesCount;
  
  const healthyHorses = horses.filter(h => h.healthStatus === 'excellent' || h.healthStatus === 'good').length;
  const realHealthyHorses = horsesData.filter(h => {
    const healthSummary = h.fields['Health Summary'];
    if (!healthSummary || typeof healthSummary !== 'string') return false;
    const lower = healthSummary.toLowerCase();
    return lower.includes('healthy') || lower.includes('excellent');
  }).length;
  
  const todayEvents = scheduleEvents.filter(e => e.date === format(new Date(), 'yyyy-MM-dd'));
  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const urgentInsights = aiInsights.filter(insight => insight.priority === 'high' || insight.priority === 'urgent');

  // Calculate revenue from both mock horses and real Airtable data
  const mockRevenue = horses.reduce((sum, horse) => sum + horse.boardingRate, 0);
  const realBarnsRevenue = barnsData.reduce((sum, barn) => {
    // Estimate revenue based on horses per barn
    const horsesInBarn = horsesData.filter(h => h.fields['Barn Name'] === barn.fields['Barn Name']).length;
    return sum + (horsesInBarn * 400); // Assume $400 per horse per month
  }, 0);
  const totalRevenue = mockRevenue + realBarnsRevenue;

  const handleInsightAction = (insight: any) => {
    toast({
      title: "Action Scheduled",
      description: `${insight.suggestedAction} has been added to your tasks.`,
    });
  };

  const handleRefreshAirtable = async () => {
    const fetchAllAirtableData = async () => {
      try {
        setAirtableLoading(true);
        setAirtableError(null);
        
        const [barns, horses] = await Promise.all([
          getAirtableData('Barns'),
          getAirtableData('Horses')
        ]);
        
        setBarnsData(barns);
        setHorsesData(horses);
        
        toast({
          title: "Data Refreshed",
          description: `Updated ${barns.length} barns and ${horses.length} horses.`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to refresh data';
        setAirtableError(errorMessage);
        toast({
          title: "Refresh Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setAirtableLoading(false);
      }
    };

    await fetchAllAirtableData();
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
          title={`${barnName} Dashboard`} 
          subtitle={`Welcome back! Here's what's happening at ${barnName} today.`}
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
          {/* AIRTABLE STATUS INDICATOR */}
          {airtableLoading && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-700">Loading barn data from Airtable...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {airtableError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Airtable Connection Error</p>
                      <p className="text-sm text-red-600">{airtableError}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshAirtable}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {(barnsData.length > 0 || horsesData.length > 0) && !airtableLoading && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Connected to Airtable</p>
                      <p className="text-sm text-green-600">
                        Successfully loaded {barnsData.length} barns and {horsesData.length} horses
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshAirtable}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                    disabled={airtableLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${airtableLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insight Carousel */}
          <InsightCarousel insights={urgentInsights} onInsightAction={handleInsightAction} />

          {/* Enhanced Weather Widget */}
          <WeatherWidget currentTime={currentTime} />

          {/* ENHANCED Key Stats - now shows combined data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              title="Total Horses"
              value={totalHorses}
              description={`${healthyHorses + realHealthyHorses} healthy horses • ${barnsData.length} barns`}
              icon={<Users className="w-6 h-6 text-primary" />}
              trend={{ value: "2", isPositive: true }}
              className="hover:shadow-barn cursor-pointer transition-barn"
            />
            <StatCard
              title="Today's Events"
              value={todayEvents.length}
              description="Scheduled activities"
              icon={<Calendar className="w-6 h-6 text-secondary" />}
              className="hover:shadow-barn cursor-pointer transition-barn"
            />
            <StatCard
              title="Monthly Revenue"
              value={`${totalRevenue.toLocaleString()}`}
              description={`Boarding, lessons & training • Airtable integration`}
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

          {/* UPDATED SECTION: Real Airtable Data Display */}
          {(barnsData.length > 0 || horsesData.length > 0) && !airtableLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Barns Section */}
              {barnsData.length > 0 && (
                <Card className="bg-gradient-card shadow-barn">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        🏚️ Live Barn Data from Airtable
                      </CardTitle>
                      <Badge variant="secondary">{barnsData.length} barns</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {barnsData.map((barn) => {
                      // Null check for barn
                      if (!barn || !barn.id || !barn.fields) return null;
                      
                      // Safe field access helper
                      const getField = (fieldName, fallback = 'N/A') => {
                        try {
                          const value = barn.fields[fieldName];
                          if (value === null || value === undefined || value === '') return fallback;
                          if (typeof value === 'string' || typeof value === 'number') return String(value);
                          if (Array.isArray(value)) return value.join(', ');
                          if (typeof value === 'object') return JSON.stringify(value);
                          return String(value);
                        } catch (error) {
                          console.warn(`Error accessing field ${fieldName}:`, error);
                          return fallback;
                        }
                      };

                      return (
                        <div key={`barn-${barn.id}`} className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:shadow-card transition-barn">
                          <h4 className="font-semibold text-foreground mb-3">
                            {getField('Barn Name', 'Unnamed Barn')}
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Owner:</span>
                              <div className="font-medium">{getField('Owner Name')}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Phone:</span>
                              <div className="font-medium">{getField('Phone')}</div>
                            </div>
                            {getField('Location') !== 'N/A' && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Location:</span>
                                <div className="font-medium text-xs">{getField('Location')}</div>
                              </div>
                            )}
                            {getField('Contact Email') !== 'N/A' && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Email:</span>
                                <div className="font-medium text-xs">{getField('Contact Email')}</div>
                              </div>
                            )}
                            {getField('Staff') !== 'N/A' && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Staff:</span>
                                <div className="font-medium text-xs">{getField('Staff')}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Horses Section */}
              {horsesData.length > 0 && (
                <Card className="bg-gradient-card shadow-barn">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        🐎 Live Horse Data from Airtable
                      </CardTitle>
                      <Badge variant="secondary">{horsesData.length} horses</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {horsesData.map((horse) => {
                      // Null check for horse
                      if (!horse || !horse.id || !horse.fields) return null;
                      
                      // Safe field access helper
                      const getField = (fieldName, fallback = 'N/A') => {
                        try {
                          const value = horse.fields[fieldName];
                          if (value === null || value === undefined || value === '') return fallback;
                          if (typeof value === 'string' || typeof value === 'number') return String(value);
                          if (Array.isArray(value)) return value.join(', ');
                          if (typeof value === 'object') return JSON.stringify(value);
                          return String(value);
                        } catch (error) {
                          console.warn(`Error accessing field ${fieldName}:`, error);
                          return fallback;
                        }
                      };

                      const getHealthStatus = () => {
                        try {
                          const health = getField('Health Summary', '').toLowerCase();
                          return health.includes('healthy') || health.includes('excellent') ? 'Healthy' : 'Monitoring';
                        } catch (error) {
                          return 'Unknown';
                        }
                      };

                      return (
                        <div key={`horse-${horse.id}`} className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:shadow-card transition-barn">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-foreground">
                              {getField('Horse Name', 'Unnamed Horse')}
                            </h4>
                            <Badge variant="default">
                              {getHealthStatus()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Breed:</span>
                              <div className="font-medium">{getField('Breed')}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Age:</span>
                              <div className="font-medium">{getField('Age', 'Unknown')} years</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Owner:</span>
                              <div className="font-medium">{getField('Owner Name')}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Barn:</span>
                              <div className="font-medium">{getField('Barn Name')}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Staff:</span>
                              <div className="font-medium">{getField('Assigned Staff')}</div>
                            </div>
                            {getField('Health Summary') !== 'N/A' && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Health:</span>
                                <div className="font-medium text-xs">{getField('Health Summary')}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleInsightAction(insight)}
                              className="ml-3 hover:shadow-card transition-barn"
                            >
                              Take Action
                            </Button>
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
            
            {/* Enhanced Revenue Breakdown */}
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
                  <div className="flex justify-center">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="gap-2"
                      onClick={() => navigate('/billing')}
                    >
                      <TrendingUp className="w-5 h-5" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <AIScheduleModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </div>
  );
};

export default Index;