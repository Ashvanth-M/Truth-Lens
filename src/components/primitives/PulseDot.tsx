import { cn } from "@/lib/utils";

export function PulseDot({ tone = "accent", size = 8 }: { tone?: "accent" | "success" | "warning" | "danger" | "critical"; size?: number }) {
  const color =
    tone === "success" ? "text-[color:var(--color-success)]" :
    tone === "warning" ? "text-[color:var(--color-warning)]" :
    tone === "danger" ? "text-[color:var(--color-danger)]" :
    tone === "critical" ? "text-[color:var(--color-critical)]" :
    "text-[color:var(--color-accent)]";
  return (
    <span className={cn("relative inline-block rounded-full pulse-ring", color)} style={{ width: size, height: size, backgroundColor: "currentColor" }} />
  );
}
