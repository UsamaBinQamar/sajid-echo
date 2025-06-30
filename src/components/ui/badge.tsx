
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "badge-ai",
  {
    variants: {
      variant: {
        default: "badge-ai-primary",
        secondary: "badge-ai-secondary",
        destructive: "bg-destructive text-destructive-foreground border-destructive",
        outline: "border-border text-foreground bg-background",
        accent: "badge-ai-accent",
        success: "bg-success text-success-foreground border-success",
        warning: "bg-warning text-warning-foreground border-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
