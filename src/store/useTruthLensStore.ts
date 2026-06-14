import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  seedAnomalies,
  type Anomaly,
  type AnomalyKind,
  sampleStudentName,
  centres,
  clusterNodes,
  clusterEdges,
  type ClusterNode,
  type ClusterEdge,
  reviewQueue as seedReviewQueue,
  auditFindings as seedFindings,
} from "@/data/mock";

export type ReviewItem = {
  id: string;
  studentId: string;
  centreId: string;
  kind: string;
  waited: string;
  priority: "critical" | "high" | "medium" | "low";
  resolved?: "confirmed" | "dismissed";
};

export type TimelineEvent = {
  id: string;
  ts: string;
  label: string;
  detail?: string;
  tone: "info" | "warn" | "critical" | "ok";
};

export type AuditFinding = {
  id: string;
  category: string;
  finding: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
};

export type Settings = {
  faceMismatch: number;
  phoneConfidence: number;
  gazeSensitivity: number;
  voiceThreshold: number;
  offlineSync: boolean;
  claudeEnabled: boolean;
  fairnessParity: number;
  fairnessOdds: number;
  dpdpRetentionDays: number;
};

const DEFAULT_SETTINGS: Settings = {
  faceMismatch: 85,
  phoneConfidence: 78,
  gazeSensitivity: 62,
  voiceThreshold: 45,
  offlineSync: true,
  claudeEnabled: true,
  fairnessParity: 11,
  fairnessOdds: 9,
  dpdpRetentionDays: 30,
};

interface State {
  // Metrics
  studentsVerified: number;
  centresOnline: number;
  liveSessions: number;
  integrityScore: number;
  openInvestigations: number;
  confirmedAnomalies: number;
  dismissedAnomalies: number;

  // Data
  anomalies: Anomaly[];
  reviewQueue: ReviewItem[];
  auditFindings: AuditFinding[];
  timelineEvents: TimelineEvent[];
  simulationHistory: { kind: AnomalyKind; ts: string }[];
  activeExam: string;
  centreRiskOverrides: Record<string, "calm" | "watch" | "elevated" | "critical">;

  extraClusters: number;
  extraNodes: ClusterNode[];
  extraEdges: ClusterEdge[];

  // Replay
  replayActive: boolean;
  replayStep: number;

  // Settings (persisted)
  settings: Settings;
  updateSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;

  // Actions
  pushAnomaly: (kind: AnomalyKind) => Anomaly;
  dismissAnomaly: (id: string) => void;
  resolveReview: (id: string, decision: "confirmed" | "dismissed") => void;
  pushTimeline: (e: Omit<TimelineEvent, "id" | "ts"> & { ts?: string }) => void;
  generateReport: () => void;
  startReplay: () => void;
  stopReplay: () => void;
  resetDemo: () => void;
}

let seq = 100;
const now = () => new Date().toTimeString().slice(0, 8);

const initialTimeline: TimelineEvent[] = [
  { id: "t-0", ts: "14:00:00", label: "Exam started · NEET Mock 2026", tone: "info" },
  { id: "t-1", ts: "14:00:42", label: "24,118 candidates verified", detail: "ZKP identity proofs locked", tone: "ok" },
  { id: "t-2", ts: "14:47:18", label: "Phone detected · Mumbai 07", tone: "critical" },
  { id: "t-3", ts: "15:01:48", label: "Cluster forming · Bengaluru 12", tone: "warn" },
];

const initialReviewQueue: ReviewItem[] = seedReviewQueue.map((r) => ({
  ...r,
  priority: r.priority as ReviewItem["priority"],
}));

// Non-persisted slice (transient demo state)
type Transient = Omit<State, "settings" | "updateSetting">;

const createTransient = (): Transient => ({
  studentsVerified: 24118,
  centresOnline: 38,
  liveSessions: 143,
  integrityScore: 98.2,
  openInvestigations: 2,
  confirmedAnomalies: 9,
  dismissedAnomalies: 3,
  anomalies: seedAnomalies,
  reviewQueue: initialReviewQueue,
  auditFindings: seedFindings.map((f) => ({ ...f, severity: f.severity as AuditFinding["severity"] })),
  timelineEvents: initialTimeline,
  simulationHistory: [],
  activeExam: "NEET Mock 2026 · National",
  centreRiskOverrides: {},
  extraClusters: 0,
  extraNodes: [],
  extraEdges: [],
  replayActive: false,
  replayStep: 0,
  pushAnomaly: () => ({} as Anomaly),
  dismissAnomaly: () => {},
  resolveReview: () => {},
  pushTimeline: () => {},
  generateReport: () => {},
  startReplay: () => {},
  stopReplay: () => {},
  resetDemo: () => {},
});

export const useTruthLensStore = create<State>()(
  persist(
    (set, get) => ({
      ...createTransient(),
      settings: DEFAULT_SETTINGS,
      updateSetting: (k, v) => set({ settings: { ...get().settings, [k]: v } }),

      pushAnomaly: (kind) => {
        seq += 1;
        const i = seq;
        const centre = centres[i % centres.length];
        const sev: Anomaly["severity"] =
          kind === "Phone detected" || kind === "Proxy attempt" || kind === "Leak cluster"
            ? "critical"
            : kind === "Second person" || kind === "Face mismatch"
              ? "high"
              : "medium";
        const a: Anomaly = {
          id: `A-${i}`,
          ts: now(),
          centreId: centre.id,
          studentId: `NEET-2026-${24000 + (i % 200)}`,
          kind,
          severity: sev,
          confidence: 70 + (i % 25),
          note: `Auto-flag: ${sampleStudentName(i)}`,
        };

        const s = get();
        const tone: TimelineEvent["tone"] =
          sev === "critical" ? "critical" : sev === "high" ? "warn" : "info";

        const newReview: ReviewItem = {
          id: `RQ-${i}`,
          studentId: a.studentId,
          centreId: a.centreId,
          kind: a.kind,
          waited: "00:00",
          priority: sev === "critical" ? "critical" : sev === "high" ? "high" : "medium",
        };

        const integrityDelta =
          kind === "Phone detected" ? -0.3
            : kind === "Proxy attempt" ? -0.6
            : kind === "Leak cluster" ? -0.9
            : kind === "Second person" ? -0.2
            : -0.1;

        let extraClusters = s.extraClusters;
        let extraNodes = s.extraNodes;
        let extraEdges = s.extraEdges;
        if (kind === "Leak cluster") {
          const base = extraNodes.length;
          const ids = [`x${base + 1}`, `x${base + 2}`, `x${base + 3}`];
          const newNodes: ClusterNode[] = ids.map((id, k) => ({
            id,
            studentId: `NEET-2026-${25000 + base + k}`,
            centreId: centres[(base + k) % centres.length].id,
            cluster: `Sim-${extraClusters + 1}`,
            similarity: 0.8 + Math.random() * 0.1,
          }));
          const newEdges: ClusterEdge[] = [
            { source: ids[0], target: ids[1], weight: 0.86, flagged: true },
            { source: ids[1], target: ids[2], weight: 0.83, flagged: true },
            { source: ids[0], target: ids[2], weight: 0.81, flagged: true },
          ];
          extraClusters += 1;
          extraNodes = [...extraNodes, ...newNodes];
          extraEdges = [...extraEdges, ...newEdges];
        }

        const newFinding: AuditFinding = {
          id: `F-${i}`,
          category:
            kind === "Leak cluster" ? "Forensics" :
            kind === "Proxy attempt" ? "Identity" :
            "Live Defence",
          finding: `${kind} flagged at ${centre.city} · ${a.confidence}% confidence · queued for human review.`,
          severity: sev,
        };

        set({
          anomalies: [a, ...s.anomalies],
          reviewQueue: [newReview, ...s.reviewQueue],
          timelineEvents: [
            { id: `t-${i}`, ts: a.ts, label: `${kind} · ${centre.city}`, detail: a.studentId, tone },
            ...s.timelineEvents,
          ],
          simulationHistory: [...s.simulationHistory, { kind, ts: a.ts }],
          openInvestigations: s.openInvestigations + (sev === "critical" ? 1 : 0),
          integrityScore: Math.max(0, +(s.integrityScore + integrityDelta).toFixed(1)),
          auditFindings: [newFinding, ...s.auditFindings].slice(0, 12),
          extraClusters,
          extraNodes,
          extraEdges,
          centreRiskOverrides: {
            ...s.centreRiskOverrides,
            [centre.id]: sev === "critical" ? "critical" : sev === "high" ? "elevated" : "watch",
          },
        });
        return a;
      },

      dismissAnomaly: (id) => {
        const s = get();
        set({
          anomalies: s.anomalies.map((a) => (a.id === id ? { ...a, dismissed: true } : a)),
          dismissedAnomalies: s.dismissedAnomalies + 1,
        });
      },

      resolveReview: (id, decision) => {
        const s = get();
        set({
          reviewQueue: s.reviewQueue.map((r) => (r.id === id ? { ...r, resolved: decision } : r)),
          confirmedAnomalies: decision === "confirmed" ? s.confirmedAnomalies + 1 : s.confirmedAnomalies,
          dismissedAnomalies: decision === "dismissed" ? s.dismissedAnomalies + 1 : s.dismissedAnomalies,
          openInvestigations: Math.max(0, s.openInvestigations - (decision === "confirmed" ? 0 : 1)),
          integrityScore:
            decision === "dismissed"
              ? Math.min(100, +(s.integrityScore + 0.2).toFixed(1))
              : s.integrityScore,
        });
      },

      pushTimeline: (e) => {
        seq += 1;
        set({
          timelineEvents: [
            { id: `t-${seq}`, ts: e.ts ?? now(), label: e.label, detail: e.detail, tone: e.tone },
            ...get().timelineEvents,
          ],
        });
      },

      generateReport: () => {
        const s = get();
        seq += 1;
        set({
          timelineEvents: [
            {
              id: `t-${seq}`,
              ts: now(),
              label: "Integrity report compiled",
              detail: `${s.anomalies.length} anomalies · ${s.extraClusters + 2} clusters`,
              tone: "info",
            },
            ...s.timelineEvents,
          ],
        });
      },

      startReplay: () => {
        if (get().replayActive) return;
        set({ replayActive: true, replayStep: 0 });
      },

      stopReplay: () => set({ replayActive: false }),

      resetDemo: () => {
        const fresh = createTransient();
        set({ ...fresh });
      },
    }),
    {
      name: "truthlens-state",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : ({ getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, key: () => null, length: 0 } as Storage),
      ),
      // Only persist settings — keep demo state ephemeral per session reload
      partialize: (s) => ({ settings: s.settings }),
    },
  ),
);

export const allClusterNodes = () => [...clusterNodes, ...useTruthLensStore.getState().extraNodes];
export const allClusterEdges = () => [...clusterEdges, ...useTruthLensStore.getState().extraEdges];

// Effective centre risk (overrides win)
export function centreRisk(id: string): "calm" | "watch" | "elevated" | "critical" {
  const override = useTruthLensStore.getState().centreRiskOverrides[id];
  if (override) return override;
  return centres.find((c) => c.id === id)?.risk ?? "calm";
}
