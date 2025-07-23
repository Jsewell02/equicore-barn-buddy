import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "react-router-dom";
import { 
  Menu, 
  Home, 
  Calendar, 
  Heart, 
  FileText, 
  Package,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, badge: '5' },
  { name: 'Scheduler', href: '/scheduler', icon: Calendar, badge: null },
  { name: 'Horses', href: '/horses', icon: Heart, badge: '2' },
  { name: 'Billing', href: '/billing', icon: FileText, badge: '1' },
  { name: 'Inventory', href: '/inventory', icon: Package, badge: '3' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border shadow-barn"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-gradient-card">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg shadow-barn">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">EquiCore</h2>
                    <p className="text-sm text-muted-foreground">AI Barn Management</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-barn",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-card"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">AI Assistant</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready to help optimize your barn operations
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}