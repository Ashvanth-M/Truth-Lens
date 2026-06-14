import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Eye, Fingerprint, GitBranch, ScrollText, Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Command",
    items: [{ to: "/command-centre", label: "Overview", icon: Activity }],
  },
  {
    label: "Identity",
    items: [{ to: "/identity-vault", label: "Identity Vault", icon: Fingerprint }],
  },
  {
    label: "Live Defence",
    items: [{ to: "/live-guard", label: "Live Guard", icon: Eye }],
  },
  {
    label: "Forensics",
    items: [{ to: "/pattern-investigator", label: "Pattern Investigator", icon: GitBranch }],
  },
  {
    label: "Compliance",
    items: [{ to: "/audit-intelligence", label: "Audit Intelligence", icon: ScrollText }],
  },
  {
    label: "System",
    items: [{ to: "/settings", label: "Settings", icon: SettingsIcon }],
  },
] as const;

export function FloatingNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [hover, setHover] = useState(false);
  const expanded = hover;

  return (
    <motion.aside
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={{ width: expanded ? 248 : 72 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong fixed left-4 top-4 bottom-4 z-40 flex flex-col overflow-hidden"
    >
      <Link to="/" className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] shadow-[var(--shadow-glow-accent)]">
          <ShieldCheck className="h-4.5 w-4.5 text-[#0B1020]" />
        </div>
        {expanded && (
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold leading-none">TruthLens</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">Integrity OS</div>
          </div>
        )}
      </Link>

      <div className="mt-2 h-px bg-[color:var(--color-hairline)]" />

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {groups.map((g) => (
          <div key={g.label} className="mb-3">
            {expanded && (
              <div className="px-3 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">
                {g.label}
              </div>
            )}
            {g.items.map((it) => {
              const active = pathname === it.to || pathname.startsWith(it.to + "/");
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/[0.06] text-white"
                      : "text-[color:var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[color:var(--color-accent-2)]"
                    />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  {expanded && <span className="truncate">{it.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[color:var(--color-hairline)] px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-[color:var(--color-text-subtle)]">
          <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-ring text-emerald-400" />
          {expanded ? <span>Offline AI · Sync OK</span> : null}
        </div>
      </div>
    </motion.aside>
  );
}
