import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-primary shadow-glow",
          sizes[size]
        )}
      >
        <TrendingUp className="h-1/2 w-1/2 text-primary-foreground" />
      </div>
      {showText && (
        <span className={cn("font-semibold tracking-tight", textSizes[size])}>
          Fund Analyser<span className="text-primary">Pro</span>
        </span>
      )}
    </div>
  );
}
