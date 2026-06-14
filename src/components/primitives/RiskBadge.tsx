import { cn } from "@/lib/utils";

const map = {
  info:     "bg-white/5 text-[color:var(--color-text-muted)] border-white/10",
  low:      "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
  medium:   "bg-amber-500/10 text-amber-300 border-amber-400/20",
  high:     "bg-rose-500/10 text-rose-300 border-rose-400/20",
  critical: "bg-[color:var(--color-critical)]/15 text-[color:var(--color-critical)] border-[color:var(--color-critical)]/30",
};

export function RiskBadge({ level, children, className }: { level: keyof typeof map; children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", map[level], className)}>
      {children ?? level}
    </span>
  );
}
