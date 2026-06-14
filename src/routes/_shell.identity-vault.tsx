import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Fingerprint, Mic, Keyboard, Lock, ShieldCheck, Sparkles, UserPlus, Check, ArrowRight, Camera, RotateCcw } from "lucide-react";
import { GlassPanel } from "@/components/primitives/GlassPanel";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/identity-vault")({
  head: () => ({ meta: [{ title: "Identity Vault — TruthLens" }] }),
  component: IdentityVault,
});

const STAGES = [
  { key: "details", label: "Student details", icon: UserPlus },
  { key: "biometric", label: "Biometric capture", icon: Fingerprint },
  { key: "zkp", label: "ZKP commit", icon: Lock },
  { key: "done", label: "Identity locked", icon: Check },
] as const;

type Stage = typeof STAGES[number]["key"];

function IdentityVault() {
  const [stage, setStage] = useState<Stage>("details");
  const [form, setForm] = useState({ name: "", aadhaar: "", centre: "C-MUM-07", phone: "" });
  const [capture, setCapture] = useState({ face: 0, voice: 0, keystroke: 0 });

  const reset = () => { setStage("details"); setCapture({ face: 0, voice: 0, keystroke: 0 }); };

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <SectionHeading
        eyebrow="Identity Vault"
        title="Tamper-evident identity, without surveillance."
        subtitle="Live enrolment workflow — captures embeddings on-device, commits a zero-knowledge proof, never stores raw biometrics."
        right={
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white hover:bg-white/[0.06]">
            <RotateCcw className="h-3 w-3" /> Restart enrolment
          </button>
        }
      />

      {/* Stage indicator */}
      <div className="grid grid-cols-4 gap-3">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const activeIdx = STAGES.findIndex((x) => x.key === stage);
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <div key={s.key} className={`relative rounded-xl border p-4 transition-colors ${active ? "border-[color:var(--color-accent-2)]/60 bg-white/[0.04]" : done ? "border-emerald-400/30 bg-emerald-400/5" : "border-[color:var(--color-hairline)] bg-white/[0.02]"}`}>
              <div className="flex items-center gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${done ? "bg-emerald-400/20 text-emerald-300" : active ? "bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] text-[#0B1020]" : "bg-white/[0.04] text-[color:var(--color-text-muted)]"}`}>
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">Stage {i + 1}</div>
                  <div className="text-sm font-semibold text-white">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <GlassPanel strong className="col-span-12 lg:col-span-7 p-6">
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {stage === "details" && (
                <DetailsForm
                  form={form}
                  setForm={setForm}
                  onNext={() => {
                    if (!form.name || !form.aadhaar) return toast.error("Name and Aadhaar required");
                    setStage("biometric");
                  }}
                />
              )}
              {stage === "biometric" && (
                <BiometricCapture capture={capture} setCapture={setCapture} onNext={() => setStage("zkp")} />
              )}
              {stage === "zkp" && <ZkpCommit onNext={() => { setStage("done"); toast.success("Identity locked"); }} />}
              {stage === "done" && <DoneState student={form.name} onReset={reset} />}
            </motion.div>
          </AnimatePresence>
        </GlassPanel>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <GlassPanel className="p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-white"><ShieldCheck className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> Privacy guarantees</div>
            <ul className="mt-3 space-y-2 text-[12px] text-[color:var(--color-text-muted)]">
              <Bullet>Raw biometrics never leave this device.</Bullet>
              <Bullet>Only embeddings + ZKP commitment ship to TruthLens.</Bullet>
              <Bullet>Aadhaar number is hashed locally before transmission.</Bullet>
              <Bullet>DPDP-aligned consent captured and signed.</Bullet>
            </ul>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="flex items-center gap-2 text-xs font-medium text-white"><Sparkles className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> Verification confidence</div>
            <div className="mt-3 space-y-3">
              <Verify label="Face" icon={Camera} conf={capture.face} />
              <Verify label="Voice" icon={Mic} conf={capture.voice} />
              <Verify label="Keystroke" icon={Keyboard} conf={capture.keystroke} />
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-accent-2)]" />
      <span>{children}</span>
    </li>
  );
}

function Verify({ label, icon: Icon, conf }: { label: string; icon: typeof Mic; conf: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-white"><Icon className="h-3 w-3 text-[color:var(--color-accent-2)]" /> {label}</span>
        <span className="font-mono text-[color:var(--color-text-muted)]">{conf.toFixed(1)}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div initial={false} animate={{ width: `${conf}%` }} transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)]" />
      </div>
    </div>
  );
}

function DetailsForm({ form, setForm, onNext }: { form: { name: string; aadhaar: string; centre: string; phone: string }; setForm: (f: typeof form) => void; onNext: () => void }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold">Student registration</h3>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Aadhaar-linked enrolment with consent captured under DPDP.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Full name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma" className="input" /></Field>
        <Field label="Aadhaar (XXXX-XXXX-XXXX)"><input value={form.aadhaar} onChange={(e) => setForm({ ...form, aadhaar: e.target.value })} placeholder="1234-5678-9012" className="input" /></Field>
        <Field label="Centre">
          <select value={form.centre} onChange={(e) => setForm({ ...form, centre: e.target.value })} className="input">
            <option value="C-MUM-07">C-MUM-07 · Mumbai</option>
            <option value="C-DEL-01">C-DEL-01 · Delhi</option>
            <option value="C-BLR-12">C-BLR-12 · Bengaluru</option>
            <option value="C-CHN-18">C-CHN-18 · Chennai</option>
          </select>
        </Field>
        <Field label="Phone (OTP)"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98xxxxxxxx" className="input" /></Field>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onNext} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-5 py-2.5 text-sm font-semibold text-[#0B1020]">
          Next · Capture biometrics <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <style>{`.input{width:100%;border-radius:.5rem;border:1px solid var(--color-hairline);background:rgba(255,255,255,.02);padding:.625rem .75rem;font-size:13px;color:#fff;outline:none}.input:focus{border-color:var(--color-accent-2)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function BiometricCapture({ capture, setCapture, onNext }: { capture: { face: number; voice: number; keystroke: number }; setCapture: (c: typeof capture) => void; onNext: () => void }) {
  const ready = capture.face >= 95 && capture.voice >= 95 && capture.keystroke >= 95;

  const simulate = (key: "face" | "voice" | "keystroke", target = 98) => {
    let v = 0;
    const id = setInterval(() => {
      v += 6 + Math.random() * 6;
      const clamped = Math.min(target, v);
      setCapture({ ...capture, [key]: clamped });
      if (clamped >= target) clearInterval(id);
    }, 70);
  };

  return (
    <div>
      <h3 className="font-display text-xl font-semibold">Capture biometrics</h3>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">All computation happens on-device. Embeddings replace raw biometrics.</p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <CaptureCard icon={Camera} label="Face embedding" desc="Look straight at the camera." done={capture.face >= 95} onCapture={() => simulate("face")} value={capture.face} />
        <CaptureCard icon={Mic} label="Voice prosody" desc="Read the passphrase aloud." done={capture.voice >= 95} onCapture={() => simulate("voice", 97)} value={capture.voice} />
        <CaptureCard icon={Keyboard} label="Keystroke rhythm" desc="Type the calibration phrase." done={capture.keystroke >= 95} onCapture={() => simulate("keystroke", 96)} value={capture.keystroke} />
      </div>

      <div className="mt-6 flex justify-end">
        <button disabled={!ready} onClick={onNext} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-5 py-2.5 text-sm font-semibold text-[#0B1020] disabled:opacity-40">
          Next · Generate ZKP <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CaptureCard({ icon: Icon, label, desc, done, value, onCapture }: { icon: typeof Mic; label: string; desc: string; done: boolean; value: number; onCapture: () => void }) {
  return (
    <div className={`rounded-xl border p-4 ${done ? "border-emerald-400/30 bg-emerald-400/5" : "border-[color:var(--color-hairline)] bg-white/[0.02]"}`}>
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] text-[#0B1020]"><Icon className="h-4 w-4" /></span>
        <div>
          <div className="text-sm font-medium text-white">{label}</div>
          <div className="text-[11px] text-[color:var(--color-text-muted)]">{desc}</div>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div initial={false} animate={{ width: `${value}%` }} className="h-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)]" />
      </div>
      <button onClick={onCapture} disabled={done} className="mt-3 w-full rounded-md bg-white/[0.06] py-1.5 text-xs text-white hover:bg-white/[0.1] disabled:opacity-50">
        {done ? "Captured" : "Capture"}
      </button>
    </div>
  );
}

function ZkpCommit({ onNext }: { onNext: () => void }) {
  const [building, setBuilding] = useState(false);
  const [hash, setHash] = useState("");
  const start = () => {
    setBuilding(true);
    let s = "";
    const id = setInterval(() => {
      s += Math.floor(Math.random() * 16).toString(16);
      setHash(s);
      if (s.length >= 32) { clearInterval(id); setBuilding(false); }
    }, 60);
  };
  return (
    <div>
      <h3 className="font-display text-xl font-semibold">Zero-knowledge commitment</h3>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Embeddings hash into a tamper-evident commitment. Verifier can prove identity without seeing biometrics.</p>

      <div className="mt-5 rounded-xl border border-[color:var(--color-hairline)] bg-black/30 p-5 font-mono text-[12px] text-emerald-300">
        <div className="text-[color:var(--color-text-subtle)]">$ truthlens-zkp commit --student NEET-2026-24xxx</div>
        <div className="mt-2">building merkle witness…</div>
        <div>compiling poseidon circuit…</div>
        <div className="mt-2">commitment: <span className="text-cyan-300">0x{hash}{building ? "▌" : ""}</span></div>
        {!building && hash.length >= 32 && <div className="mt-1 text-emerald-300">✔ signature verified · published to vault</div>}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        {!hash && <button onClick={start} className="rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-5 py-2.5 text-sm font-semibold text-[#0B1020]">Generate ZKP</button>}
        {hash && !building && (
          <button onClick={onNext} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-5 py-2.5 text-sm font-semibold text-[#0B1020]">
            Finish <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function DoneState({ student, onReset }: { student: string; onReset: () => void }) {
  return (
    <div className="text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
        <Check className="h-8 w-8" />
      </motion.div>
      <h3 className="mt-4 font-display text-2xl font-semibold">Identity locked</h3>
      <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{student || "Candidate"} enrolled successfully. Raw biometrics discarded. ZKP commit published.</p>
      <div className="mt-5 flex justify-center gap-2">
        <button onClick={onReset} className="rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-4 py-2 text-xs text-white hover:bg-white/[0.06]">Enrol another</button>
      </div>
    </div>
  );
}
