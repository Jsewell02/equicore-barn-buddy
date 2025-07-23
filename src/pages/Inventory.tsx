import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import PageHeader from "@/components/layout/PageHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { ReorderInventoryModal } from "@/components/modals/ReorderInventoryModal";
import { 
  Plus, 
  Package, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import { getDynamicMockData } from "@/data/dynamicMockData";
import { useDemoContext } from "@/contexts/DemoContext";
import { format } from "date-fns";

const Inventory = () => {
  const { demoState } = useDemoContext();
  const { inventory } = getDynamicMockData(demoState);
  const [filter, setFilter] = useState('all');
  const [reorderItem, setReorderItem] = useState<any>(null);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const criticalItems = inventory.filter(item => item.currentStock < item.minStock * 0.5);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feed': return 'success';
      case 'bedding': return 'secondary';
      case 'supplements': return 'warning';
      case 'equipment': return 'primary';
      case 'medical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStockStatus = (item: any) => {
    if (item.currentStock < item.minStock * 0.5) return 'critical';
    if (item.currentStock <= item.minStock) return 'low';
    return 'good';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'low': return 'warning';
      case 'good': return 'success';
      default: return 'secondary';
    }
  };

  const filteredItems = filter === 'all' ? inventory : inventory.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-gradient-meadow">
      <MobileNav />
      <Navigation />
      
      <div className="lg:pl-72">
        <PageHeader 
          title="Inventory Management" 
          subtitle="Track feed, bedding, supplements, and equipment"
          action={
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="barn" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Reorder List
              </Button>
            </div>
          }
        />

        <div className="p-4 lg:p-8 space-y-6">
          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{inventory.length}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{lowStockItems.length}</div>
                <div className="text-sm text-muted-foreground">Low Stock</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <TrendingDown className="w-8 h-8 text-destructive mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{criticalItems.length}</div>
                <div className="text-sm text-muted-foreground">Critical</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  ${inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-sunset/5 border-accent/20 shadow-barn">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI Inventory Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Timothy Hay Running Low</h4>
                    <p className="text-sm text-muted-foreground">15 bales remaining, 3-week supply at current usage</p>
                  </div>
                  <Button 
                    variant="warning" 
                    size="sm"
                    onClick={() => setReorderItem(inventory.find(item => item.name === 'Timothy Hay'))}
                  >
                    Reorder
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Bulk Discount Available</h4>
                    <p className="text-sm text-muted-foreground">Save 15% on Sweet Feed with orders over 20 bags</p>
                  </div>
                  <Button variant="meadow" size="sm">View Deal</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Filter by category:</span>
                  <div className="flex gap-2">
                    {['all', 'feed', 'bedding', 'supplements', 'equipment', 'medical'].map((cat) => (
                      <Button
                        key={cat}
                        variant={filter === cat ? 'barn' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(cat)}
                        className="capitalize"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item);
              const stockPercentage = (item.currentStock / (item.minStock * 2)) * 100;
              
              return (
                <Card key={item.id} className="bg-gradient-card shadow-barn hover:shadow-glow transition-barn">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant={getCategoryColor(item.category) as any}>
                        {item.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stock Level */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Stock Level</span>
                        <Badge variant={getStockColor(stockStatus) as any}>
                          {stockStatus}
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-barn ${
                            stockStatus === 'critical' ? 'bg-destructive' :
                            stockStatus === 'low' ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{item.currentStock} {item.unit}</span>
                        <span>Min: {item.minStock} {item.unit}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Unit Cost:</span>
                        <span className="font-medium text-foreground">${item.costPerUnit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Value:</span>
                        <span className="font-medium text-foreground">
                          ${(item.currentStock * item.costPerUnit).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Supplier:</span>
                        <span className="font-medium text-foreground">{item.supplier}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Restocked:</span>
                        <span className="font-medium text-foreground">
                          {format(new Date(item.lastRestocked), 'MMM d')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {stockStatus === 'critical' || stockStatus === 'low' ? (
                        <Button 
                          variant="barn" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setReorderItem(item)}
                        >
                          Reorder Now
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1">
                          Adjust Stock
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Reorder Recommendations */}
          <Card className="bg-gradient-card shadow-barn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Recommended Reorders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div>
                      <div className="font-medium text-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Current: {item.currentStock} {item.unit} • Min: {item.minStock} {item.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Supplier: {item.supplier}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">
                        Suggested: {item.minStock * 2} {item.unit}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Cost: ${(item.minStock * 2 * item.costPerUnit).toFixed(2)}
                      </div>
                      <Button 
                        variant="barn" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setReorderItem(item)}
                      >
                        Add to Order
                      </Button>
                    </div>
                  </div>
                ))}
                {lowStockItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>All items are well stocked!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ReorderInventoryModal 
        isOpen={!!reorderItem}
        onClose={() => setReorderItem(null)}
        item={reorderItem}
      />
    </div>
  );
};

export default Inventory;