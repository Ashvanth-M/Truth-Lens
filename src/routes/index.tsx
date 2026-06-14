import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, ShieldCheck, Wifi, Lock, Users } from "lucide-react";
import { IndiaIntelVisual } from "@/components/landing/IndiaIntelVisual";
import { AnimatedCounter } from "@/components/primitives/AnimatedCounter";
import { LandingSections } from "@/components/landing/LandingSections";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TruthLens — Agentic Exam Integrity OS for India" },
      { name: "description", content: "Protecting 30+ million students from impersonation, organised cheating, and paper leaks. Privacy-first. Offline-first. Fairness-first." },
    ],
  }),
  component: Landing,
});

const badges = [
  { label: "DPDP Compliant", icon: ShieldCheck },
  { label: "Offline AI", icon: Wifi },
  { label: "Zero-Knowledge Biometrics", icon: Lock },
  { label: "Human Reviewed", icon: Users },
];

function Landing() {
  const startReplay = useTruthLensStore((s) => s.startReplay);
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Top brand */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] shadow-[var(--shadow-glow-accent)]">
            <ShieldCheck className="h-4.5 w-4.5 text-[#0B1020]" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold leading-none">TruthLens</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">
              Integrity OS · v1.0
            </div>
          </div>
        </div>
        <Link to="/command-centre" className="text-xs text-[color:var(--color-text-muted)] hover:text-white">
          Launch Console →
        </Link>
      </header>

      <div className="relative z-10 grid grid-cols-1 gap-10 px-8 pb-20 pt-6 md:px-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-16">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]"
          >
            <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" /> FAR AWAY 2026 · Examinations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl"
          >
            <span className="text-gradient-accent">Agentic Exam Integrity</span>
            <br /> OS for India.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--color-text-muted)] md:text-lg"
          >
            Protecting 30+ million students from impersonation, organised cheating, and paper leaks.
            <span className="text-white"> Privacy-first. Offline-first. Fairness-first.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/command-centre"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-6 py-3 text-sm font-semibold text-[#0B1020] shadow-[0_20px_50px_-15px_rgba(124,123,255,0.6)] transition-transform hover:scale-[1.02]"
            >
              Launch Command Centre
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              onClick={() => { startReplay(); toast("Replay started"); }}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.06]"
            >
              <PlayCircle className="h-4 w-4" /> Watch Replay
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {badges.map((b) => {
              const I = b.icon;
              return (
                <span key={b.label} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline)] bg-white/[0.02] px-3 py-1.5 text-[11px] text-[color:var(--color-text-muted)]">
                  <I className="h-3.5 w-3.5" /> {b.label}
                </span>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-6 border-t border-[color:var(--color-hairline)] pt-6"
          >
            <Stat n={30_000_000} label="Students protected" suffix="+" />
            <Stat n={38} label="Centres online" />
            <Stat n={143} label="Live sessions" />
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="glass-strong relative h-[420px] overflow-hidden md:h-[560px] lg:h-[640px]"
        >
          <IndiaIntelVisual />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-accent-2)] to-transparent opacity-60" />
        </motion.div>
      </div>

      <LandingSections />
    </div>
  );
}

function Stat({ n, label, suffix }: { n: number; label: string; suffix?: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold md:text-3xl">
        <AnimatedCounter value={n} suffix={suffix} />
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{label}</div>
    </div>
  );
}
