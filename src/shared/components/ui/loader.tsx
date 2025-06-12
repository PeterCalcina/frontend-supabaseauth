import { cn } from "@/shared/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export function Loader({
  className,
  size = "md",
  message = "Cargando...",
  ...props
}: LoaderProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "md",
            "h-8 w-8": size === "lg",
          },
          className
        )}  
        {...props}
      >
        <span className="sr-only"></span>
      </div>
      <span className="text-sm">{message}</span>
    </div>
  );
}
