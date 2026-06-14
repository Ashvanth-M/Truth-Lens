import { createFileRoute } from "@tanstack/react-router";
import { Eye, ShieldAlert, Wifi, Cpu, AlertTriangle, UserCheck } from "lucide-react";
import { GlassPanel } from "@/components/primitives/GlassPanel";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { PulseDot } from "@/components/primitives/PulseDot";
import { seedSessions } from "@/data/mock";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { WebcamViewport } from "@/components/liveguard/WebcamViewport";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/live-guard")({
  head: () => ({ meta: [{ title: "Live Guard — TruthLens" }] }),
  component: LiveGuard,
});

function LiveGuard() {
  const anomalies = useTruthLensStore((s) => s.anomalies);
  const queue = useTruthLensStore((s) => s.reviewQueue);
  const resolve = useTruthLensStore((s) => s.resolveReview);
  const dismissAnomaly = useTruthLensStore((s) => s.dismissAnomaly);
  const focused = seedSessions[2];

  const trend = Array.from({ length: 24 }).map((_, i) => ({ x: i, y: 30 + Math.round(Math.sin(i / 2) * 18) + (i % 3) * 4 }));

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <SectionHeading
        eyebrow="Live Guard"
        title="Security operations centre for live exams"
        subtitle="On-device inference. Human reviewers in the loop. No auto-disqualification — ever."
        right={
          <div className="flex items-center gap-3 text-[11px] text-[color:var(--color-text-muted)]">
            <PulseDot tone="success" /> Offline AI engaged
            <span className="ml-3 inline-flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5" /> Sync OK</span>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <GlassPanel className="col-span-12 lg:col-span-8 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Eye className="h-4 w-4 text-[color:var(--color-accent-2)]" />
              Candidate · {focused.studentName}
              <span className="ml-2 rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-[color:var(--color-text-muted)]">{focused.studentId}</span>
            </div>
            <RiskBadge level="high">Flagged</RiskBadge>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_280px]">
            <WebcamViewport overlays={{ face: true, phone: true, gaze: true }} />

            <div className="space-y-3">
              <Metric label="Face confidence" value="92.4%" tone="ok" />
              <Metric label="Gaze drift (60s)" value="38%" tone="warn" />
              <Metric label="Objects detected" value="mobile-phone" tone="bad" />
              <Metric label="Voice anomaly" value="None" tone="ok" />
              <div className="pt-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">Confidence trend</div>
                <div className="mt-1 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend}>
                      <YAxis hide domain={[0, 100]} />
                      <Line dataKey="y" stroke="#22D3EE" strokeWidth={1.6} dot={false} type="monotone" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">Session timeline</div>
            <div className="relative mt-2 h-2 rounded-full bg-white/[0.05]">
              <div className="absolute inset-y-0 left-0 w-[62%] rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)]" />
              {[20, 35, 48, 62].map((p, i) => (
                <span key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center" style={{ left: `${p}%` }}>
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-critical)] ring-2 ring-[#0B1020]" />
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--color-text-subtle)]">
              <span>14:00 · Start</span><span>14:48 · Now</span><span>17:00 · End</span>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-12 lg:col-span-4 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white"><ShieldAlert className="h-4 w-4 text-[color:var(--color-accent-2)]" /> Active alerts</div>
          <div className="mt-3 h-px bg-[color:var(--color-hairline)]" />
          <ul className="mt-3 max-h-[480px] space-y-2 overflow-y-auto pr-1">
            {anomalies.filter((a) => !a.dismissed).slice(0, 8).map((a) => (
              <li key={a.id} className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">{a.kind}</span>
                  <RiskBadge level={a.severity}>{a.severity}</RiskBadge>
                </div>
                <div className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">{a.studentId} · {a.centreId} · {a.confidence}%</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-[color:var(--color-text-subtle)]">
                    <UserCheck className="h-3 w-3" /> {a.reviewer ?? "Awaiting reviewer"}
                  </span>
                  <button onClick={() => { dismissAnomaly(a.id); toast(`Dismissed ${a.id}`); }} className="rounded-md border border-[color:var(--color-hairline)] px-2 py-0.5 text-[10px] text-[color:var(--color-text-muted)] hover:text-white">
                    Dismiss
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>

      <GlassPanel className="p-5">
        <div className="flex items-center justify-between">
          <SectionHeading eyebrow="Human Review" title="Review queue — every flag is a human decision" />
          <div className="flex items-center gap-3 text-[11px] text-[color:var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" /> Offline inference</span>
            <span className="inline-flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> No auto-disqualification</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {queue.slice(0, 10).map((r) => (
            <div key={r.id} className={`rounded-xl border bg-white/[0.02] p-4 ${r.resolved ? "border-emerald-400/20 opacity-60" : "border-[color:var(--color-hairline)]"}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[color:var(--color-text-muted)]">{r.studentId}</span>
                <RiskBadge level={r.priority}>{r.priority}</RiskBadge>
              </div>
              <div className="mt-2 text-sm font-medium text-white">{r.kind}</div>
              <div className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">{r.centreId} · waited {r.waited}</div>
              {r.resolved ? (
                <div className="mt-3 rounded-md bg-emerald-400/10 px-2 py-1 text-center text-[11px] text-emerald-300 capitalize">{r.resolved}</div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { resolve(r.id, "confirmed"); toast.success("Confirmed"); }} className="flex-1 rounded-md bg-white/[0.06] px-3 py-1.5 text-xs text-white hover:bg-white/[0.1]">
                    Confirm
                  </button>
                  <button onClick={() => { resolve(r.id, "dismissed"); toast("Dismissed"); }} className="rounded-md border border-[color:var(--color-hairline)] px-3 py-1.5 text-xs text-[color:var(--color-text-muted)] hover:text-white">
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "bad" }) {
  const color = tone === "ok" ? "text-emerald-300" : tone === "warn" ? "text-amber-300" : "text-rose-300";
  return (
    <div className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{label}</div>
      <div className={`mt-1 font-display text-sm font-semibold ${color}`}>{value}</div>
    </div>
  );
}
