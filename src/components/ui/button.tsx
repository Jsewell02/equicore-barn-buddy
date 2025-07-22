import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-barn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-barn transform hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-meadow",
        outline: "border-2 border-border bg-transparent hover:bg-muted hover:text-foreground hover:border-primary",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:shadow-meadow transform hover:-translate-y-0.5",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-light",
        barn: "bg-gradient-primary text-primary-foreground shadow-barn hover:shadow-glow transform hover:-translate-y-1 hover:scale-[1.02]",
        meadow: "bg-gradient-secondary text-secondary-foreground shadow-meadow hover:shadow-barn transform hover:-translate-y-0.5",
        sunset: "bg-gradient-sunset text-accent-foreground shadow-glow hover:shadow-barn transform hover:-translate-y-0.5",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-meadow",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-barn",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4",
        lg: "h-13 rounded-lg px-8 text-base",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
