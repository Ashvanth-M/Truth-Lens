import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, Wifi, Lock, Users, Fingerprint, Eye, GitBranch, ScrollText, X, Check, Smartphone, UserX, ArrowRight, PlayCircle, Cpu, Database, CloudOff, Sparkles, Building2, GraduationCap } from "lucide-react";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import { AnimatedCounter } from "@/components/primitives/AnimatedCounter";
import { toast } from "sonner";

export function LandingSections() {
  const push = useTruthLensStore((s) => s.pushAnomaly);
  const startReplay = useTruthLensStore((s) => s.startReplay);

  return (
    <div className="relative z-10 mx-auto max-w-[1400px] space-y-32 px-8 pb-32 md:px-12">
      {/* SECTION 2 — THE CRISIS */}
      <Section eyebrow="The crisis" title="India's examination system is under siege.">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["30M+", "Students take high-stakes exams yearly"],
            ["1.3M+", "Affected by NEET 2024 controversy"],
            ["13", "States impacted by leaks since 2022"],
            ["0", "Systems cover the full exam lifecycle"],
          ].map(([n, l]) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="glass p-6"
            >
              <div className="font-display text-4xl font-semibold text-gradient-accent md:text-5xl">{n}</div>
              <div className="mt-3 text-sm text-[color:var(--color-text-muted)]">{l}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION 3 — COMPARISON */}
      <Section eyebrow="Why current solutions fail" title="Proctoring software wasn't built for national-scale integrity.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CompareCard title="Traditional proctoring" tone="bad" items={[
            ["Uploads raw video to the cloud", false],
            ["Requires constant high-bandwidth internet", false],
            ["Auto-disqualifies on false positives", false],
            ["Only watches during the exam", false],
            ["No leak / collusion investigation", false],
          ]} />
          <CompareCard title="TruthLens" tone="ok" items={[
            ["On-device AI · nothing uploaded", true],
            ["Offline-first · works at 2G", true],
            ["Human reviewer required · zero auto-DQ", true],
            ["Protects the full exam lifecycle", true],
            ["Forensic collusion + leak detection", true],
          ]} />
        </div>
      </Section>

      {/* SECTION 4 — LIFECYCLE */}
      <Section eyebrow="How TruthLens works" title="One platform. Four guarantees.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { icon: Fingerprint, label: "Identity Vault", desc: "ZKP-locked enrolment. No raw biometrics.", to: "/identity-vault" },
            { icon: Eye, label: "Live Guard", desc: "On-device proctoring. Human in the loop.", to: "/live-guard" },
            { icon: GitBranch, label: "Pattern Investigator", desc: "Forensic graph of collusion clusters.", to: "/pattern-investigator" },
            { icon: ScrollText, label: "Audit Intelligence", desc: "Signed, DPDP-compliant board report.", to: "/audit-intelligence" },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <Link key={step.label} to={step.to} className="group">
                <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass relative h-full p-6 transition-colors hover:bg-white/[0.04]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">Stage {i + 1}</div>
                  <span className="mt-2 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] text-[#0B1020]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-3 font-display text-lg font-semibold">{step.label}</div>
                  <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{step.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] text-[color:var(--color-accent-2)] opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* SECTION 5 — TRY THE SYSTEM */}
      <Section eyebrow="Try the system" title="Drive the live pipeline. From this page.">
        <div className="glass-strong p-8">
          <p className="max-w-2xl text-sm text-[color:var(--color-text-muted)]">
            Click any button to inject an anomaly into the running system. The Command Centre, Live Guard, Investigator, and Audit update immediately.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            <SimBtn icon={Smartphone} label="Phone" onClick={() => { push("Phone detected"); toast.success("Phone detected · propagated"); }} />
            <SimBtn icon={UserX} label="Proxy" onClick={() => { push("Proxy attempt"); toast.success("Proxy flagged"); }} />
            <SimBtn icon={GitBranch} label="Leak" onClick={() => { push("Leak cluster"); toast.success("Cluster surfaced"); }} />
            <SimBtn icon={Users} label="Second person" onClick={() => { push("Second person"); toast.success("Second person flagged"); }} />
            <SimBtn icon={Eye} label="Gaze" onClick={() => { push("Suspicious gaze"); toast.success("Gaze anomaly added"); }} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => { startReplay(); toast("Replay started"); }} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-2.5 text-sm font-semibold text-[#0B1020]">
              <PlayCircle className="h-4 w-4" /> Replay NEET Mock 2026
            </button>
            <Link to="/command-centre" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white hover:bg-white/[0.06]">
              Open Command Centre <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* SECTION 6 — ARCHITECTURE */}
      <Section eyebrow="Architecture" title="Edge inference. Sovereign data. Cloud-optional intelligence.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
          {[
            { icon: Smartphone, label: "Exam device" },
            { icon: Eye, label: "MediaPipe / OpenCV" },
            { icon: Database, label: "SQLite" },
            { icon: CloudOff, label: "Offline sync" },
            { icon: Cpu, label: "FastAPI" },
            { icon: Sparkles, label: "Claude (opt-in)" },
          ].map((n, i) => {
            const Icon = n.icon;
            return (
              <motion.div key={n.label} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] text-[#0B1020]"><Icon className="h-4 w-4" /></span>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">Layer {i + 1}</div>
                  <div className="text-sm font-medium text-white">{n.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* SECTION 7 — PRIVACY */}
      <Section eyebrow="Privacy" title="Built to be useless to attackers.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {["NO VIDEO UPLOADS", "NO RAW BIOMETRICS", "ZERO-KNOWLEDGE PROOFS", "HUMAN REVIEW REQUIRED", "DPDP COMPLIANT"].map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass-strong grid place-items-center p-6 text-center">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
              <div className="mt-3 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-white">{t}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SECTION 8 — IMPACT */}
      <Section eyebrow="Impact" title="Built for every examining body in India.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { icon: Building2, label: "NTA" },
            { icon: GraduationCap, label: "CBSE" },
            { icon: ShieldCheck, label: "UPSC" },
            { icon: Building2, label: "State Boards" },
            { icon: GraduationCap, label: "Universities" },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div key={b.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass grid place-items-center p-6">
                <Icon className="h-7 w-7 text-[color:var(--color-accent-2)]" />
                <div className="mt-3 font-display text-base font-semibold text-white">{b.label}</div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <Stat n={24118} label="Verified today" />
          <Stat n={38} label="Centres online" />
          <Stat n={2} label="Clusters under review" />
        </div>
      </Section>

      {/* SECTION 9 — FINAL CTA */}
      <section className="relative overflow-hidden">
        <div className="glass-strong relative grid place-items-center px-8 py-20 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-accent-2)] to-transparent" />
          <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)]">TruthLens</div>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            <span className="text-gradient-accent">Restoring trust</span> in examinations.
          </h2>
          <p className="mt-4 max-w-xl text-base text-[color:var(--color-text-muted)]">
            One operating system for identity, live defence, forensics, and audit. Built for India. Ready for deployment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/command-centre" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-6 py-3 text-sm font-semibold text-[#0B1020]">
              Launch Command Centre <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={() => { startReplay(); toast("Replay started"); }} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.06]">
              <PlayCircle className="h-4 w-4" /> Watch Replay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-text-subtle)]">{eyebrow}</div>
        <h2 className="mt-2 max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

function CompareCard({ title, tone, items }: { title: string; tone: "ok" | "bad"; items: [string, boolean][] }) {
  return (
    <div className={`glass relative p-6 ${tone === "ok" ? "border-emerald-400/20" : "border-rose-400/20"}`}>
      <div className="font-display text-lg font-semibold">{title}</div>
      <ul className="mt-4 space-y-2">
        {items.map(([t, ok]) => (
          <li key={t} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${ok ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"}`}>
              {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </span>
            <span className={ok ? "text-white" : "text-[color:var(--color-text-muted)]"}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SimBtn({ icon: Icon, label, onClick }: { icon: typeof Lock; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-center gap-2 rounded-xl border border-[color:var(--color-hairline)] bg-white/[0.02] p-4 transition-all hover:border-[color:var(--color-hairline-strong)] hover:bg-white/[0.05]">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] text-[#0B1020]"><Icon className="h-4 w-4" /></span>
      <span className="text-xs font-medium text-white">{label}</span>
    </button>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="glass p-5 text-center">
      <div className="font-display text-3xl font-semibold text-white"><AnimatedCounter value={n} /></div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{label}</div>
    </div>
  );
}
