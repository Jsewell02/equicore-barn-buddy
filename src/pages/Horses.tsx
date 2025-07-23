import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/layout/Navigation";
import PageHeader from "@/components/layout/PageHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { AddVetVisitModal } from "@/components/modals/AddVetVisitModal";
import { 
  Plus, 
  Search, 
  Heart, 
  Calendar, 
  FileText, 
  Paperclip,
  AlertTriangle,
  Activity,
  TrendingUp,
  Eye,
  Stethoscope
} from "lucide-react";
import { getDynamicMockData } from "@/data/dynamicMockData";
import { useDemoContext } from "@/contexts/DemoContext";
import { format } from "date-fns";
import horsesImage from "@/assets/horses-fence.jpg";

const Horses = () => {
  const { demoState } = useDemoContext();
  const { horses } = getDynamicMockData(demoState);
  const [selectedHorse, setSelectedHorse] = useState(horses[0]);
  const [showVetModal, setShowVetModal] = useState(false);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'secondary';
      case 'needs-attention': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-meadow">
      <MobileNav />
      <Navigation />
      
      <div className="lg:pl-72">
        <PageHeader 
          title="Horse Management" 
          subtitle="Monitor health, feeding, and care for all your horses"
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="barn" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Horse
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Health Report
              </Button>
            </div>
          }
        />

        <div className="p-4 lg:p-8 space-y-6">
          {/* Horse Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Horse List */}
            <Card className="bg-gradient-card shadow-barn">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    All Horses ({horses.length})
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {horses.map((horse) => (
                  <div
                    key={horse.id}
                    onClick={() => setSelectedHorse(horse)}
                    className={`p-4 rounded-lg border cursor-pointer transition-barn hover:shadow-card ${
                      selectedHorse.id === horse.id 
                        ? 'bg-primary/10 border-primary shadow-card' 
                        : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{horse.name}</h3>
                      <Badge variant={getHealthStatusColor(horse.healthStatus) as any}>
                        {horse.healthStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{horse.breed} • {horse.age} years old</p>
                    <p className="text-sm text-muted-foreground">Owner: {horse.owner}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-success font-medium">${horse.boardingRate}/month</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Horse Details */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card shadow-barn">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedHorse.name}</CardTitle>
                      <p className="text-muted-foreground">
                        {selectedHorse.breed} • {selectedHorse.age} years old • {selectedHorse.color}
                      </p>
                    </div>
                    <Badge variant={getHealthStatusColor(selectedHorse.healthStatus) as any} className="text-sm">
                      {selectedHorse.healthStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="health" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="health">Health Logs</TabsTrigger>
                      <TabsTrigger value="feeding">Feeding Notes</TabsTrigger>
                      <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="health" className="mt-6 space-y-6">
                      {/* Health Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-card shadow-card">
                          <CardContent className="p-4 text-center">
                            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="text-lg font-semibold text-foreground">Health Status</div>
                            <div className="text-sm text-muted-foreground">{selectedHorse.healthStatus}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-card shadow-card">
                          <CardContent className="p-4 text-center">
                            <Activity className="w-8 h-8 text-secondary mx-auto mb-2" />
                            <div className="text-lg font-semibold text-foreground">Last Vet Visit</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(selectedHorse.lastVetVisit), 'MMM d, yyyy')}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-card shadow-card">
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                            <div className="text-lg font-semibold text-foreground">Farrier Visit</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(selectedHorse.lastFarrierVisit), 'MMM d, yyyy')}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Health Alerts */}
                      {selectedHorse.healthStatus === 'needs-attention' && (
                        <Card className="bg-warning/5 border-warning/20">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-foreground">Attention Required</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Farrier visit overdue by 2 weeks. Schedule appointment soon for optimal hoof health.
                                </p>
                <Button variant="warning" size="sm" className="mt-3">
                  Schedule Farrier
                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Recent Health Logs */}
                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Health Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-background rounded-lg border border-border/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground">Routine Checkup</span>
                              <span className="text-sm text-muted-foreground">July 1, 2024</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Annual physical exam completed. All vitals normal. Vaccinations up to date.
                            </p>
                          </div>
                          <div className="p-3 bg-background rounded-lg border border-border/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground">Dental Work</span>
                              <span className="text-sm text-muted-foreground">May 15, 2024</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Routine dental floating performed. No issues found. Next checkup in 12 months.
                            </p>
                          </div>
                        </CardContent>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="barn" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => setShowVetModal(true)}
                          >
                            <Stethoscope className="w-4 h-4" />
                            Add Vet Visit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Entry
                          </Button>
                        </div>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="feeding" className="mt-6 space-y-6">
                      {/* Feeding Schedule */}
                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">Current Feeding Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-background rounded-lg border border-border/50">
                              <h4 className="font-medium text-foreground mb-2">Hay</h4>
                              <p className="text-sm text-muted-foreground">{selectedHorse.feeding.hay}</p>
                            </div>
                            <div className="p-4 bg-background rounded-lg border border-border/50">
                              <h4 className="font-medium text-foreground mb-2">Grain</h4>
                              <p className="text-sm text-muted-foreground">{selectedHorse.feeding.grain}</p>
                            </div>
                          </div>
                          <div className="p-4 bg-background rounded-lg border border-border/50">
                            <h4 className="font-medium text-foreground mb-2">Supplements</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedHorse.feeding.supplements.map((supplement, index) => (
                                <Badge key={index} variant="secondary">{supplement}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Feeding Notes */}
                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Feeding Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 bg-background rounded-lg border border-border/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">Morning Feed - Today</span>
                              <span className="text-xs text-muted-foreground">7:30 AM</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Normal appetite, finished all hay and grain.</p>
                          </div>
                          <div className="p-3 bg-background rounded-lg border border-border/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">Evening Feed - Yesterday</span>
                              <span className="text-xs text-muted-foreground">6:00 PM</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Left small amount of grain. May be feeling warm weather.</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="attachments" className="mt-6 space-y-6">
                      {/* Attachments */}
                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">Documents & Photos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 bg-background rounded-lg border border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Paperclip className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-foreground">Vaccination_Record_2024.pdf</div>
                                <div className="text-xs text-muted-foreground">Updated July 1, 2024</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="p-3 bg-background rounded-lg border border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Paperclip className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-foreground">Coggins_Test_2024.pdf</div>
                                <div className="text-xs text-muted-foreground">Updated June 15, 2024</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="p-3 bg-background rounded-lg border border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Paperclip className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-foreground">Insurance_Policy.pdf</div>
                                <div className="text-xs text-muted-foreground">Updated January 1, 2024</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Horse Notes */}
          <Card className="bg-gradient-card shadow-barn">
            <CardHeader>
              <CardTitle>Notes about {selectedHorse.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{selectedHorse.notes}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AddVetVisitModal 
        isOpen={showVetModal}
        onClose={() => setShowVetModal(false)}
        horseName={selectedHorse.name}
      />
    </div>
  );
};

export default Horses;