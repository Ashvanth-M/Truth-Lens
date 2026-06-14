import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GlassPanel({ className, strong, children, ...rest }: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div className={cn(strong ? "glass-strong" : "glass", "relative", className)} {...rest}>
      {children}
    </div>
  );
}
