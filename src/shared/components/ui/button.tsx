import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-blue-600/90 border border-2 border-primary/20",
        destructive:
          "bg-destructive text-destructive-foreground border hover:bg-red-600/90",
        outlineWhite:
          "border-none bg-transparent hover:bg-[var(--palette-magenta)] hover:text-white",
        outlineTransparent:
          "border-none border-transparent bg-transparent hover:bg-purple-500/20 hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-secondary/20",
        success:
          "bg-green-500 text-white hover:bg-green-600/90 border border-green-500/20",
        ghost: "hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-accent/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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