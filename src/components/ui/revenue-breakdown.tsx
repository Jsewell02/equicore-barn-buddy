import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RevenueBreakdownProps {
  totalRevenue: number;
}

export const RevenueBreakdown = ({ totalRevenue }: RevenueBreakdownProps) => {
  // Calculate breakdown (in a real app, this would come from actual data)
  const boardingRevenue = Math.round(totalRevenue * 0.75);
  const lessonRevenue = Math.round(totalRevenue * 0.15);
  const trainingRevenue = Math.round(totalRevenue * 0.10);
  
  const revenueItems = [
    { label: "Boarding", amount: boardingRevenue, percentage: 75 },
    { label: "Lessons", amount: lessonRevenue, percentage: 15 },
    { label: "Training", amount: trainingRevenue, percentage: 10 },
  ];

  return (
    <Card className="bg-gradient-card shadow-barn">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-success" />
          Monthly Revenue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-success">
            <TrendingUp className="w-4 h-4" />
            +8.2% vs last month
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          {revenueItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full bg-primary"
                  style={{ opacity: item.percentage / 100 }}
                />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  ${item.amount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};