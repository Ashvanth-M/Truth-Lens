import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Activity, Radio, ScanEye, ShieldCheck, Cpu, Cloud, Scale, GitBranch, FileText, Download, Play, Lock } from "lucide-react";
import { GlassPanel } from "@/components/primitives/GlassPanel";
import { AnimatedCounter } from "@/components/primitives/AnimatedCounter";
import { PulseDot } from "@/components/primitives/PulseDot";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { centres } from "@/data/mock";
import { useTruthLensStore, centreRisk } from "@/store/useTruthLensStore";
import { CentreDetailModal } from "@/components/command/CentreDetailModal";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_shell/command-centre")({
  head: () => ({ meta: [{ title: "Command Centre — TruthLens" }, { name: "description", content: "Real-time exam integrity operations centre." }] }),
  component: CommandCentre,
});

function CommandCentre() {
  const anomalies = useTruthLensStore((s) => s.anomalies);
  const studentsVerified = useTruthLensStore((s) => s.studentsVerified);
  const centresOnline = useTruthLensStore((s) => s.centresOnline);
  const integrityScore = useTruthLensStore((s) => s.integrityScore);
  const openInvestigations = useTruthLensStore((s) => s.openInvestigations);
  const extraClusters = useTruthLensStore((s) => s.extraClusters);
  const generateReport = useTruthLensStore((s) => s.generateReport);
  const startReplay = useTruthLensStore((s) => s.startReplay);
  const overrides = useTruthLensStore((s) => s.centreRiskOverrides);
  const navigate = useNavigate();

  const [selectedCentre, setSelectedCentre] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      {/* Mission status bar */}
      <GlassPanel strong className="flex flex-wrap items-center gap-x-8 gap-y-3 p-4 px-6">
        <div className="flex items-center gap-3">
          <PulseDot tone="critical" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">Active exam</div>
            <div className="font-display text-sm font-semibold">NEET Mock 2026 · National</div>
          </div>
        </div>
        <Divider />
        <Metric label="Status" value="EXAM LIVE" tone="critical" />
        <Divider />
        <Metric label="Students verified" value={<AnimatedCounter value={studentsVerified} />} />
        <Divider />
        <Metric label="Centres online" value={<><AnimatedCounter value={centresOnline} />/38</>} />
        <Divider />
        <Metric label="Open investigations" value={<AnimatedCounter value={openInvestigations + extraClusters} />} />
        <Divider />
        <Metric label="Integrity score" value={integrityScore.toFixed(1)} suffix="%" tone={integrityScore > 95 ? "ok" : "critical"} />
        <div className="ml-auto">
          <button onClick={() => { startReplay(); toast("Replay started"); }} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-3 py-1.5 text-[11px] font-semibold text-[#0B1020]">
            <Play className="h-3 w-3" /> Replay NEET Mock 2026
          </button>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-12 gap-6">
        {/* Left — anomaly timeline */}
        <GlassPanel className="col-span-12 lg:col-span-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-white"><Radio className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> Live anomaly stream</div>
            <span className="text-[10px] text-[color:var(--color-text-subtle)]">SOC</span>
          </div>
          <div className="mt-3 h-px bg-[color:var(--color-hairline)]" />
          <ul className="mt-3 max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {anomalies.slice(0, 14).map((a, idx) => (
              <motion.li
                key={a.id}
                initial={idx === 0 ? { opacity: 0, x: -10 } : false}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-2.5"
              >
                <div className="flex items-center justify-between text-[10px] text-[color:var(--color-text-subtle)]">
                  <span>{a.ts}</span>
                  <RiskBadge level={a.severity}>{a.severity}</RiskBadge>
                </div>
                <div className="mt-1 text-xs font-medium text-white">{a.kind}</div>
                <div className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">
                  {a.studentId} · {a.centreId}
                </div>
              </motion.li>
            ))}
          </ul>
        </GlassPanel>

        {/* Centre — threat map */}
        <GlassPanel className="col-span-12 lg:col-span-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-white">
              <ScanEye className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> National threat map · click a centre
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[color:var(--color-text-subtle)]">
              <LegendDot color="#34D399" label="Calm" />
              <LegendDot color="#FBBF24" label="Watch" />
              <LegendDot color="#F59E0B" label="Elevated" />
              <LegendDot color="#FF3D6E" label="Critical" />
            </div>
          </div>
          <div className="relative mt-3 h-[540px] overflow-hidden rounded-lg border border-[color:var(--color-hairline)] bg-[color:var(--color-bg-raised)]">
            <ThreatMap onSelect={setSelectedCentre} overrides={overrides} />
          </div>
        </GlassPanel>

        {/* Right — ops insights */}
        <GlassPanel className="col-span-12 lg:col-span-3 p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-white"><ShieldCheck className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> Operational insights</div>
          <div className="mt-3 h-px bg-[color:var(--color-hairline)]" />
          <div className="mt-4 space-y-4">
            <Ring label="Privacy compliance" value={100} icon={Lock} />
            <Ring label="Offline sync health" value={98} icon={Cloud} />
            <Ring label="Fairness score" value={96} icon={Scale} />
            <Ring label="System integrity" value={Math.round(integrityScore)} icon={Cpu} />
          </div>
        </GlassPanel>
      </div>

      {/* Quick actions */}
      <GlassPanel className="p-4">
        <SectionHeading eyebrow="Quick actions" title="Run operations" />
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <ActionCard icon={Activity} label="Launch Enrolment" desc="Open Identity Vault enrolment workflow." onClick={() => navigate({ to: "/identity-vault" })} />
          <ActionCard icon={GitBranch} label="View Investigations" desc={`${extraClusters + 2} active clusters`} onClick={() => navigate({ to: "/pattern-investigator" })} />
          <ActionCard icon={FileText} label="Generate Audit Report" desc="Compile board-ready integrity report." onClick={() => { generateReport(); toast.success("Audit compiled."); navigate({ to: "/audit-intelligence" }); }} />
          <ActionCard icon={Download} label="Export Findings" desc="DPDP-compliant CSV bundle." onClick={() => toast("Demo: would download evidence bundle.")} />
        </div>
      </GlassPanel>

      <CentreDetailModal centreId={selectedCentre} onClose={() => setSelectedCentre(null)} />
    </div>
  );
}

function Divider() { return <div className="h-8 w-px bg-[color:var(--color-hairline)]" />; }
function LegendDot({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} /> {label}</span>;
}
function Metric({ label, value, tone, suffix }: { label: string; value: React.ReactNode; tone?: "ok" | "critical"; suffix?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{label}</div>
      <div className={
        "font-display text-base font-semibold " +
        (tone === "critical" ? "text-[color:var(--color-critical)]" : tone === "ok" ? "text-emerald-300" : "text-white")
      }>{value}{suffix}</div>
    </div>
  );
}

function Ring({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Lock }) {
  const r = 22, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" />
          <circle cx="28" cy="28" r={r} stroke="url(#ringGrad)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 28 28)" />
          <defs>
            <linearGradient id="ringGrad">
              <stop offset="0%" stopColor="#7C7BFF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-[11px] font-semibold text-white">{value}</div>
      </div>
      <div>
        <div className="text-xs font-medium text-white">{label}</div>
        <div className="text-[10px] text-[color:var(--color-text-subtle)]">Nominal</div>
      </div>
      <Icon className="ml-auto h-4 w-4 text-[color:var(--color-text-subtle)]" />
    </div>
  );
}

function ActionCard({ icon: Icon, label, desc, onClick }: { icon: typeof Lock; label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex items-start gap-3 rounded-xl border border-[color:var(--color-hairline)] bg-white/[0.02] p-4 text-left transition-all hover:border-[color:var(--color-hairline-strong)] hover:bg-white/[0.04]">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] text-[#0B1020]"><Icon className="h-4 w-4" /></span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-0.5 block text-[11px] text-[color:var(--color-text-muted)]">{desc}</span>
      </span>
    </button>
  );
}

function ThreatMap({ onSelect, overrides }: { onSelect: (id: string) => void; overrides: Record<string, string> }) {
  return (
    <svg viewBox="0 0 1000 1100" className="h-full w-full">
      <defs>
        <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
        </pattern>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C7BFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7C7BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1100" fill="url(#mapGrid)" />
      <path
        d="M420,140 L470,130 L520,150 L560,180 L600,170 L650,200 L690,250 L720,310 L760,360 L820,400 L860,450 L870,510 L820,540 L780,560 L740,610 L720,680 L680,740 L640,790 L600,840 L560,890 L520,930 L480,950 L460,920 L450,880 L430,830 L410,790 L390,760 L360,720 L340,680 L320,640 L300,580 L290,520 L300,460 L320,410 L350,370 L370,310 L380,260 L390,210 L400,170 Z"
        fill="rgba(124,123,255,0.08)" stroke="rgba(124,123,255,0.35)" strokeWidth="1.2"
      />
      {centres.map((c, i) => {
        const risk = (overrides[c.id] as "calm" | "watch" | "elevated" | "critical") ?? centreRisk(c.id);
        const color = risk === "critical" ? "#FF3D6E" : risk === "elevated" ? "#F59E0B" : risk === "watch" ? "#FBBF24" : "#34D399";
        return (
          <g key={c.id} transform={`translate(${c.x},${c.y})`} className="cursor-pointer" onClick={() => onSelect(c.id)}>
            <circle r="22" fill="transparent" />
            <circle r="20" fill="url(#mapGlow)" />
            <motion.circle r="4" fill={color} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.06 }} />
            {(risk === "critical" || risk === "elevated") && (
              <motion.circle r="6" fill="none" stroke={color} strokeWidth="1.2" animate={{ scale: [1, 3.4, 3.4], opacity: [0.7, 0, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.12 }} />
            )}
            <text x="10" y="4" fontSize="9" fill="rgba(255,255,255,0.55)" fontFamily="Inter" pointerEvents="none">{c.city}</text>
          </g>
        );
      })}
    </svg>
  );
}
