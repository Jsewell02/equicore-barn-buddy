import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface DemoTooltipProps {
  children: ReactNode;
  content: string;
  showIcon?: boolean;
}

export const DemoTooltip = ({ children, content, showIcon = true }: DemoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-block">
            {children}
            {showIcon && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <HelpCircle className="w-3 h-3 text-accent-foreground" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-accent text-accent-foreground border-accent/20">
          <p className="text-sm font-medium">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};