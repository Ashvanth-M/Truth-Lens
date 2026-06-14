import { useEffect, useRef } from "react";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import { toast } from "sonner";

/**
 * Replay engine — when replayActive becomes true, ticks through a
 * scripted timeline and dispatches actions to the global store.
 * Mounted once at the shell layout so every page sees updates.
 */
const SCRIPT: { delay: number; run: () => void; toast?: string }[] = [
  {
    delay: 600,
    toast: "Replay started · NEET Mock 2026",
    run: () => useTruthLensStore.getState().pushTimeline({ label: "Replay started", detail: "NEET Mock 2026", tone: "info" }),
  },
  {
    delay: 1400,
    run: () => useTruthLensStore.getState().pushTimeline({ label: "15:00 · Identity verified · 24,118 students", tone: "ok" }),
  },
  {
    delay: 1400,
    run: () => useTruthLensStore.getState().pushTimeline({ label: "15:02 · Student authenticated · Mumbai 07", tone: "ok" }),
  },
  {
    delay: 1600,
    toast: "Phone detected · Mumbai 07",
    run: () => useTruthLensStore.getState().pushAnomaly("Phone detected"),
  },
  {
    delay: 1400,
    run: () => useTruthLensStore.getState().pushTimeline({ label: "15:06 · Invigilator notified", detail: "Centre 07 · Mumbai", tone: "warn" }),
  },
  {
    delay: 1500,
    run: () => useTruthLensStore.getState().pushTimeline({ label: "15:09 · Human review initiated", tone: "info" }),
  },
  {
    delay: 1800,
    toast: "Cluster forming · Bengaluru 12",
    run: () => useTruthLensStore.getState().pushAnomaly("Leak cluster"),
  },
  {
    delay: 1500,
    toast: "Pattern Investigator escalated",
    run: () => useTruthLensStore.getState().pushTimeline({ label: "15:14 · Pattern Investigator escalated", tone: "critical" }),
  },
  {
    delay: 1600,
    run: () => useTruthLensStore.getState().pushAnomaly("Proxy attempt"),
  },
  {
    delay: 1800,
    toast: "Audit report generated",
    run: () => {
      useTruthLensStore.getState().generateReport();
      useTruthLensStore.getState().pushTimeline({ label: "15:18 · Audit report compiled", tone: "ok" });
    },
  },
  {
    delay: 800,
    run: () => useTruthLensStore.getState().stopReplay(),
  },
];

export function ReplayEngine() {
  const active = useTruthLensStore((s) => s.replayActive);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!active) {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      return;
    }
    let acc = 0;
    SCRIPT.forEach((step) => {
      acc += step.delay;
      const t = setTimeout(() => {
        step.run();
        if (step.toast) toast(step.toast);
      }, acc);
      timers.current.push(t);
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [active]);

  return null;
}
