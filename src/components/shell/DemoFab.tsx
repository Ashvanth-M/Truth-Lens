import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Smartphone, Users, Eye, UserX, GitBranch, X, PlayCircle, RotateCcw, Command } from "lucide-react";
import { toast } from "sonner";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import type { AnomalyKind } from "@/data/mock";

const options: { kind: AnomalyKind; label: string; icon: typeof Zap; tone: string }[] = [
  { kind: "Phone detected", label: "Phone detected", icon: Smartphone, tone: "from-rose-500 to-rose-600" },
  { kind: "Second person", label: "Second person in frame", icon: Users, tone: "from-amber-500 to-amber-600" },
  { kind: "Suspicious gaze", label: "Suspicious gaze pattern", icon: Eye, tone: "from-violet-500 to-violet-600" },
  { kind: "Proxy attempt", label: "Proxy / impersonation", icon: UserX, tone: "from-pink-500 to-rose-500" },
  { kind: "Leak cluster", label: "Question leak cluster", icon: GitBranch, tone: "from-cyan-500 to-sky-500" },
];

export function DemoFab() {
  const [open, setOpen] = useState(false);
  const push = useTruthLensStore((s) => s.pushAnomaly);
  const startReplay = useTruthLensStore((s) => s.startReplay);
  const resetDemo = useTruthLensStore((s) => s.resetDemo);
  const replayActive = useTruthLensStore((s) => s.replayActive);

  const fire = (k: AnomalyKind) => {
    const a = push(k);
    toast.success(`Simulated: ${k}`, {
      description:
        k === "Leak cluster"
          ? "New collusion cluster surfaced in Pattern Investigator."
          : `${a.studentId} · ${a.centreId} · ${a.confidence}% confidence`,
    });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0B1020] shadow-[0_20px_50px_-15px_rgba(124,123,255,0.6)] transition-transform hover:scale-[1.03] active:scale-95"
      >
        <Zap className="h-4 w-4" />
        Demo Console
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative w-full max-w-2xl p-6"
            >
              <button onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-md p-1.5 text-[color:var(--color-text-muted)] hover:bg-white/5 hover:text-white">
                <X className="h-4 w-4" />
              </button>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)]">Demo console</div>
              <h3 className="mt-1 font-display text-xl font-semibold">TruthLens controls</h3>
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                Drive the live pipeline. Every action propagates to Command Centre, Live Guard, Investigator, and Audit.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  disabled={replayActive}
                  onClick={() => { startReplay(); toast("Replay started"); setOpen(false); }}
                  className="group col-span-1 flex items-center gap-3 rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-3 text-left transition-all hover:border-cyan-300/50 hover:bg-cyan-400/15 disabled:opacity-50 sm:col-span-2"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-sky-500 text-[#0B1020]">
                    <PlayCircle className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-white">Replay NEET Mock 2026</span>
                    <span className="block text-[11px] text-[color:var(--color-text-muted)]">60-second guided demo · auto-drives every page</span>
                  </span>
                  <span className="ml-auto text-[10px] uppercase tracking-[0.18em] text-cyan-200">{replayActive ? "Running" : "Start"}</span>
                </button>
              </div>

              <div className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">Simulate anomaly</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {options.map((o) => {
                  const Icon = o.icon;
                  return (
                    <button
                      key={o.kind}
                      onClick={() => fire(o.kind)}
                      className="group flex items-center gap-3 rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3 text-left transition-all hover:border-[color:var(--color-hairline-strong)] hover:bg-white/[0.04]"
                    >
                      <span className={`grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br ${o.tone} text-white`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-white">{o.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[color:var(--color-hairline)] pt-4 text-[11px] text-[color:var(--color-text-muted)]">
                <span className="inline-flex items-center gap-1.5"><Command className="h-3 w-3" /> ⌘K · command palette</span>
                <button
                  onClick={() => { resetDemo(); toast("Demo state reset"); setOpen(false); }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-hairline)] px-2.5 py-1 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" /> Reset demo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
