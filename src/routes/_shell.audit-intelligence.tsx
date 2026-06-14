import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Download, FileText, Sparkles, ShieldCheck, RefreshCw } from "lucide-react";
import { GlassPanel } from "@/components/primitives/GlassPanel";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/audit-intelligence")({
  head: () => ({ meta: [{ title: "Audit Intelligence — TruthLens" }] }),
  component: AuditIntelligence,
});

function AuditIntelligence() {
  const findings = useTruthLensStore((s) => s.auditFindings);
  const anomalies = useTruthLensStore((s) => s.anomalies);
  const integrity = useTruthLensStore((s) => s.integrityScore);
  const confirmed = useTruthLensStore((s) => s.confirmedAnomalies);
  const dismissed = useTruthLensStore((s) => s.dismissedAnomalies);
  const extraClusters = useTruthLensStore((s) => s.extraClusters);
  const studentsVerified = useTruthLensStore((s) => s.studentsVerified);
  const timeline = useTruthLensStore((s) => s.timelineEvents);
  const generate = useTruthLensStore((s) => s.generateReport);

  const totalAnomalies = anomalies.length;
  const totalClusters = 2 + extraClusters;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <SectionHeading
        eyebrow="Audit Intelligence"
        title="Board-ready integrity report"
        subtitle="A signed, DPDP-compliant report that explains every decision — and the reasoning behind it."
        right={
          <div className="flex gap-2">
            <button onClick={() => { generate(); toast.success("Report regenerated"); }} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-3 py-2 text-xs text-white hover:bg-white/[0.06]">
              <RefreshCw className="h-3.5 w-3.5" /> Regenerate
            </button>
            <button onClick={() => toast.success("Demo: would export signed PDF")} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-4 py-2 text-xs font-semibold text-[#0B1020]">
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        }
      />

      <GlassPanel strong className="overflow-hidden p-0">
        <div className="relative border-b border-[color:var(--color-hairline)] p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-critical)]/60 to-transparent" />
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-rose-200">
                <ShieldCheck className="h-3 w-3" /> For Official Use Only
              </div>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">NEET Mock 2026 · Integrity Report</h1>
              <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-muted)]">
                Compiled by TruthLens v1.0 · Issued {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} · Report ID RPT-2026-{String(totalAnomalies + 14).padStart(3, "0")} · Reviewed by human invigilators.
              </p>
            </div>
            <IntegrityRing value={integrity} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_280px]">
          <div className="space-y-7">
            <Section title="Executive summary">
              <p>
                Across <strong className="text-white">{studentsVerified.toLocaleString("en-IN")}</strong> verified candidates at 38 centres, TruthLens surfaced{" "}
                <strong className="text-white">{totalAnomalies} anomalies</strong> and{" "}
                <strong className="text-white">{totalClusters} collusion cluster{totalClusters === 1 ? "" : "s"}</strong>.{" "}
                {confirmed} of the surfaced events were confirmed by human reviewers and {dismissed} were dismissed as false positives.
                Identity verification operated within DPDP boundaries with zero raw biometrics persisted server-side.
              </p>
            </Section>

            <Section title="Evidence">
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {findings.map((f) => (
                  <motion.li key={f.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{f.category}</span>
                      <RiskBadge level={f.severity}>{f.severity}</RiskBadge>
                    </div>
                    <div className="mt-1 text-sm text-white/90">{f.finding}</div>
                  </motion.li>
                ))}
              </ul>
            </Section>

            <Section title="Recommendations">
              <ul className="list-disc space-y-1 pl-5">
                <li>Re-test the {3 + extraClusters} candidate clusters under proctored conditions.</li>
                <li>Audit invigilator rotation at high-risk centres prior to NEET 2026 mains.</li>
                <li>Promote on-device gaze model v2.1 → v2.2 after fairness review.</li>
              </ul>
            </Section>

            <Section title="Timeline">
              <ol className="relative space-y-3 border-l border-[color:var(--color-hairline)] pl-5">
                {timeline.slice(0, 8).map((t) => (
                  <li key={t.id}>
                    <span className={`absolute -left-[7px] mt-1 h-3 w-3 rounded-full border bg-[#0B1020] ${t.tone === "critical" ? "border-rose-400" : t.tone === "warn" ? "border-amber-400" : t.tone === "ok" ? "border-emerald-400" : "border-[color:var(--color-accent-2)]"}`} />
                    <div className="text-xs text-[color:var(--color-text-subtle)]">{t.ts}</div>
                    <div className="text-sm text-white/90">{t.label}{t.detail ? <span className="text-[color:var(--color-text-muted)]"> · {t.detail}</span> : null}</div>
                  </li>
                ))}
              </ol>
            </Section>
          </div>

          <aside className="space-y-4">
            <ClaudeAnalysis anomalyCount={totalAnomalies} clusters={totalClusters} confirmed={confirmed} />

            <GlassPanel className="p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-white"><FileText className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> Signatures</div>
              <div className="mt-3 space-y-2 text-[11px] text-[color:var(--color-text-muted)]">
                <Sig name="A. Iyer" role="Lead invigilator" />
                <Sig name="R. Menon" role="Centre supervisor" />
                <Sig name={`SHA-${(totalAnomalies * 7919 + 11).toString(16).padStart(8, "0")}`} role="System hash" mono />
              </div>
            </GlassPanel>
          </aside>
        </div>
      </GlassPanel>
    </div>
  );
}

function ClaudeAnalysis({ anomalyCount, clusters, confirmed }: { anomalyCount: number; clusters: number; confirmed: number }) {
  const full = `Of ${anomalyCount} surfaced anomalies, ${Math.max(0, confirmed)} align with established cheating signatures; the remainder reflect benign behaviour consistent with stressed test-takers. ${clusters} collusion cluster${clusters === 1 ? "" : "s"} detected — recommend retaining current thresholds and raising voice-anomaly threshold by 4 points to reduce false positives.`;
  const [text, setText] = useState("");
  useEffect(() => {
    setText("");
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [full]);
  return (
    <GlassPanel className="p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-white"><Sparkles className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> Claude analysis</div>
      <p className="mt-2 min-h-[6rem] text-[12px] leading-relaxed text-[color:var(--color-text-muted)]">
        "{text}<span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-cyan-300/70 align-middle" />"
      </p>
      <div className="mt-3 text-[10px] text-[color:var(--color-text-subtle)]">— Claude · Anthropic · synthesised summary</div>
    </GlassPanel>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{children}</div>
    </motion.section>
  );
}

function Sig({ name, role, mono }: { name: string; role: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-[color:var(--color-hairline)] pt-2">
      <span className={mono ? "font-mono" : ""}>{name}</span>
      <span className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{role}</span>
    </div>
  );
}

function IntegrityRing({ value }: { value: number }) {
  const r = 36, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r={r} stroke="url(#integGrad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 50 50)" />
        <defs>
          <linearGradient id="integGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-xl font-semibold">{value.toFixed(1)}</div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">Integrity</div>
        </div>
      </div>
    </div>
  );
}
