import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, Home, Package, Users, Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Scheduler", path: "/scheduler" },
    { icon: Users, label: "Horses", path: "/horses" },
    { icon: FileText, label: "Billing", path: "/billing" },
    { icon: Package, label: "Inventory", path: "/inventory" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-primary border-b border-border/20 shadow-barn">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">EquiCore</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary-foreground hover:bg-primary-light/20"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
          <div className="bg-gradient-primary min-h-full w-80 shadow-barn">
            <div className="p-4 border-b border-primary-light/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="text-xl font-bold text-primary-foreground">EquiCore</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-primary-foreground hover:bg-primary-light/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition-barn",
                      isActive
                        ? "bg-primary-light/30 text-primary-foreground shadow-card"
                        : "text-primary-foreground/80 hover:bg-primary-light/20 hover:text-primary-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-gradient-primary shadow-barn">
        <div className="flex flex-col flex-grow">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-primary-light/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-card">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">EquiCore</h1>
                <p className="text-primary-foreground/60 text-sm">AI Barn Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-barn group",
                    isActive
                      ? "bg-primary-light/30 text-primary-foreground shadow-card transform translate-x-1"
                      : "text-primary-foreground/80 hover:bg-primary-light/20 hover:text-primary-foreground hover:translate-x-1"
                  )}
                >
                  <Icon className="w-5 h-5 transition-barn group-hover:scale-110" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* AI Assistant Teaser */}
          <div className="px-4 pb-6">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-primary-foreground">AI Assistant</span>
              </div>
              <p className="text-xs text-primary-foreground/60 mb-3">
                Get smart insights about your barn operations
              </p>
              <Button variant="sunset" size="sm" className="w-full">
                Ask AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Main Content Spacing */}
      <div className="lg:pl-72">
        {/* Notification Bar */}
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">
                <strong>2 AI insights</strong> available • Bella needs farrier visit
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground">
              View All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;