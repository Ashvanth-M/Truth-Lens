import { createFileRoute } from "@tanstack/react-router";
import { Building2, Sliders, Cloud, Sparkles, Fingerprint, Scale, ShieldCheck, ScrollText } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "@/components/primitives/GlassPanel";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import { toast } from "sonner";
import { centres } from "@/data/mock";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — TruthLens" }] }),
  component: Settings,
});

const sections = [
  { id: "centres", label: "Centres", icon: Building2 },
  { id: "thresholds", label: "Thresholds", icon: Sliders },
  { id: "sync", label: "Offline sync", icon: Cloud },
  { id: "claude", label: "Claude", icon: Sparkles },
  { id: "biometrics", label: "Biometrics", icon: Fingerprint },
  { id: "fairness", label: "Fairness", icon: Scale },
  { id: "dpdp", label: "DPDP", icon: ShieldCheck },
  { id: "logs", label: "Audit logs", icon: ScrollText },
] as const;

function Settings() {
  const [active, setActive] = useState<typeof sections[number]["id"]>("thresholds");
  return (
    <div className="mx-auto max-w-[1300px] space-y-6">
      <SectionHeading eyebrow="System" title="Control centre" subtitle="Modular policy surfaces — every change is signed, logged, and persisted." />

      <div className="grid grid-cols-12 gap-6">
        <GlassPanel className="col-span-12 lg:col-span-3 p-3">
          {sections.map((s) => {
            const I = s.icon;
            const isActive = active === s.id;
            return (
              <button key={s.id} onClick={() => setActive(s.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-white/[0.06] text-white" : "text-[color:var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white"}`}>
                <I className="h-4 w-4" /> {s.label}
              </button>
            );
          })}
        </GlassPanel>

        <div className="col-span-12 lg:col-span-9 space-y-4">
          {active === "thresholds" && <ThresholdsCard />}
          {active === "centres" && <CentresCard />}
          {active === "sync" && <SyncCard />}
          {active === "claude" && <ClaudeCard />}
          {active === "biometrics" && <BiometricsCard />}
          {active === "fairness" && <FairnessCard />}
          {active === "dpdp" && <DpdpCard />}
          {active === "logs" && <LogsCard />}
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <GlassPanel className="p-6">
      <div className="font-display text-lg font-semibold">{title}</div>
      {subtitle && <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">{subtitle}</div>}
      <div className="mt-5">{children}</div>
    </GlassPanel>
  );
}

function PersistedSlider({ label, settingKey, suffix }: { label: string; settingKey: keyof ReturnType<typeof useTruthLensStore.getState>["settings"]; suffix?: string }) {
  const v = useTruthLensStore((s) => s.settings[settingKey]) as number;
  const update = useTruthLensStore((s) => s.updateSetting);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[color:var(--color-text-muted)]">{label}</span>
        <span className="font-mono text-white">{v}{suffix}</span>
      </div>
      <input
        type="range" min={0} max={100} value={v}
        onChange={(e) => update(settingKey, Number(e.target.value))}
        className="mt-2 w-full accent-[color:var(--color-accent-2)]"
      />
    </div>
  );
}

function ThresholdsCard() {
  return (
    <Card title="Detection thresholds" subtitle="Tune sensitivity. Higher = stricter. Persisted to local storage and signed.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PersistedSlider label="Face mismatch threshold" settingKey="faceMismatch" suffix="%" />
        <PersistedSlider label="Phone detection confidence" settingKey="phoneConfidence" suffix="%" />
        <PersistedSlider label="Gaze drift sensitivity" settingKey="gazeSensitivity" suffix="%" />
        <PersistedSlider label="Voice anomaly threshold" settingKey="voiceThreshold" suffix="%" />
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={() => toast.success("Thresholds saved · signed change")} className="rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-4 py-2 text-xs font-semibold text-[#0B1020]">Save changes</button>
      </div>
    </Card>
  );
}

function CentresCard() {
  return (
    <Card title="Centre management" subtitle={`${centres.length} centres provisioned.`}>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 max-h-96 overflow-y-auto pr-1">
        {centres.slice(0, 16).map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3 text-sm">
            <span className="font-mono text-[12px] text-white/90">{c.id} · {c.city} · {c.capacity}</span>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">Online</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SyncCard() {
  const enabled = useTruthLensStore((s) => s.settings.offlineSync);
  const update = useTruthLensStore((s) => s.updateSetting);
  return (
    <Card title="Offline sync" subtitle="Edge inference with deferred sync. Tested for sub-second proctoring at 2G.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Last sync", "2s ago"], ["Pending events", "0"], ["Queue depth", "12"], ["Bandwidth", "Adaptive"]].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{k}</div>
            <div className="mt-1 font-display text-sm font-semibold text-white">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-4">
        <div>
          <div className="text-sm font-medium text-white">Edge sync enabled</div>
          <div className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">Disable to operate fully offline (events queue locally).</div>
        </div>
        <Toggle on={enabled} onChange={(v) => update("offlineSync", v)} />
      </div>
    </Card>
  );
}

function ClaudeCard() {
  const enabled = useTruthLensStore((s) => s.settings.claudeEnabled);
  const update = useTruthLensStore((s) => s.updateSetting);
  return (
    <Card title="Claude integration" subtitle="Optional analysis layer for audit synthesis. Off-device, opt-in, redacted inputs only.">
      <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-4">
        <div>
          <div className="text-sm font-medium text-white">Audit synthesis</div>
          <div className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">Generates board-ready summaries from anonymised event streams.</div>
        </div>
        <Toggle on={enabled} onChange={(v) => update("claudeEnabled", v)} />
      </div>
    </Card>
  );
}

function BiometricsCard() {
  const days = useTruthLensStore((s) => s.settings.dpdpRetentionDays);
  const update = useTruthLensStore((s) => s.updateSetting);
  return (
    <Card title="Biometric policies" subtitle="Embeddings only. No raw biometrics persisted server-side.">
      <div className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[color:var(--color-text-muted)]">Embedding retention (days)</span>
          <span className="font-mono text-white">{days}d</span>
        </div>
        <input type="range" min={7} max={90} value={days} onChange={(e) => update("dpdpRetentionDays", Number(e.target.value))} className="mt-2 w-full accent-[color:var(--color-accent-2)]" />
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {["Voice prosody hashed with ZKP commitments", "Keystroke rhythm computed on-device only"].map((t) => (
          <li key={t} className="flex items-center gap-2 rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-2)]" /> {t}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function FairnessCard() {
  return (
    <Card title="Fairness thresholds" subtitle="Demographic parity & equalised odds across cohorts.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PersistedSlider label="Max demographic parity Δ" settingKey="fairnessParity" suffix="‰" />
        <PersistedSlider label="Max equalised odds Δ" settingKey="fairnessOdds" suffix="‰" />
      </div>
    </Card>
  );
}

function DpdpCard() {
  return (
    <Card title="DPDP compliance" subtitle="India Digital Personal Data Protection Act, 2023.">
      <div className="space-y-2 text-sm">
        {["Consent capture v2.3 (active)", "Right to erasure: 72h SLA", "Cross-border transfers: disabled", "Data fiduciary: TruthLens India"].map((t) => (
          <div key={t} className="flex items-center justify-between rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
            <span>{t}</span><span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">Compliant</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function LogsCard() {
  const history = useTruthLensStore((s) => s.simulationHistory);
  const timeline = useTruthLensStore((s) => s.timelineEvents);
  return (
    <Card title="Audit logs" subtitle="Every policy change, every reviewer decision — signed and immutable.">
      <ul className="space-y-1.5 font-mono text-[12px] text-[color:var(--color-text-muted)]">
        {timeline.slice(0, 6).map((t) => (
          <li key={t.id}>{t.ts} · {t.label}{t.detail ? ` · ${t.detail}` : ""}</li>
        ))}
        {history.length > 0 && <li className="pt-2 text-[color:var(--color-text-subtle)]">— Simulations ({history.length}) —</li>}
        {history.slice(-4).map((h, i) => (
          <li key={i}>{h.ts} · simulated · {h.kind}</li>
        ))}
      </ul>
    </Card>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={`relative h-6 w-10 rounded-full transition-colors ${on ? "bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)]" : "bg-white/10"}`}>
      <span className={`absolute top-0.5 grid h-5 w-5 place-items-center rounded-full bg-white shadow transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );
}
