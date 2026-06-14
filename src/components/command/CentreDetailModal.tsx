import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, ScanEye, UserCheck, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { centres, type Centre } from "@/data/mock";
import { useTruthLensStore, centreRisk } from "@/store/useTruthLensStore";

export function CentreDetailModal({ centreId, onClose }: { centreId: string | null; onClose: () => void }) {
  const centre = centres.find((c) => c.id === centreId) ?? null;
  const anomalies = useTruthLensStore((s) => s.anomalies);
  const centreAnomalies = centre ? anomalies.filter((a) => a.centreId === centre.id && !a.dismissed) : [];
  const risk = centre ? centreRisk(centre.id) : "calm";

  return (
    <AnimatePresence>
      {centre && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-xl p-6"
          >
            <button onClick={onClose} className="absolute right-4 top-4 rounded-md p-1.5 text-[color:var(--color-text-muted)] hover:bg-white/5 hover:text-white">
              <X className="h-4 w-4" />
            </button>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)]">Examination centre</div>
            <h3 className="mt-1 font-display text-2xl font-semibold">{centre.name} · {centre.city}</h3>
            <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">{centre.id} · {centre.state}</div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Capacity" value={String(centre.capacity)} />
              <Stat label="Online" value={String(centre.online)} />
              <Stat label="Open alerts" value={String(centreAnomalies.length)} tone={centreAnomalies.length > 0 ? "warn" : "ok"} />
              <Stat label="Risk" value={risk} tone={risk === "critical" ? "bad" : risk === "elevated" || risk === "watch" ? "warn" : "ok"} />
            </div>

            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">Recent activity</div>
              <ul className="mt-2 space-y-2 max-h-44 overflow-y-auto pr-1">
                {centreAnomalies.length === 0 && (
                  <li className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3 text-xs text-[color:var(--color-text-muted)]">
                    No active anomalies. Centre operating normally.
                  </li>
                )}
                {centreAnomalies.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3 text-xs">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-300" />
                    <span className="font-medium text-white">{a.kind}</span>
                    <span className="text-[color:var(--color-text-muted)]">· {a.studentId}</span>
                    <span className="ml-auto text-[color:var(--color-text-subtle)]">{a.ts}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/live-guard" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-3 py-1.5 text-[11px] font-semibold text-[#0B1020]">
                <ScanEye className="h-3 w-3" /> Open Live Guard <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link to="/pattern-investigator" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white hover:bg-white/[0.06]">
                <UserCheck className="h-3 w-3" /> Pattern Investigator
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" | "bad" }) {
  const color = tone === "bad" ? "text-rose-300" : tone === "warn" ? "text-amber-300" : tone === "ok" ? "text-emerald-300" : "text-white";
  return (
    <div className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{label}</div>
      <div className={`mt-1 font-display text-sm font-semibold capitalize ${color}`}>{value}</div>
    </div>
  );
}
