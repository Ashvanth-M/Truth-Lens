import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, type Node, type Edge, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { GitBranch, Brain, AlertOctagon, Filter, Play } from "lucide-react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/primitives/GlassPanel";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { clusterNodes, clusterEdges, centres } from "@/data/mock";
import { useTruthLensStore } from "@/store/useTruthLensStore";

export const Route = createFileRoute("/_shell/pattern-investigator")({
  head: () => ({ meta: [{ title: "Pattern Investigator — TruthLens" }] }),
  component: PatternInvestigator,
});

function PatternInvestigator() {
  const extraNodes = useTruthLensStore((s) => s.extraNodes);
  const extraEdges = useTruthLensStore((s) => s.extraEdges);
  const [selected, setSelected] = useState<string | null>("n1");
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const layout = useMemo(() => {
    const all = [...clusterNodes, ...extraNodes];
    const positions: Record<string, { x: number; y: number }> = {};
    // Cluster Alpha center
    const alpha = all.filter((n) => n.cluster === "Alpha");
    alpha.forEach((n, i) => {
      const a = (i / alpha.length) * Math.PI * 2;
      positions[n.id] = { x: 280 + Math.cos(a) * 100, y: 260 + Math.sin(a) * 100 };
    });
    const bravo = all.filter((n) => n.cluster === "Bravo");
    bravo.forEach((n, i) => {
      const a = (i / bravo.length) * Math.PI * 2;
      positions[n.id] = { x: 760 + Math.cos(a) * 90, y: 320 + Math.sin(a) * 90 };
    });
    const sims = all.filter((n) => n.cluster && n.cluster.startsWith("Sim-"));
    sims.forEach((n, i) => {
      const cx = 540 + ((i % 3) - 1) * 220;
      const cy = 540;
      positions[n.id] = { x: cx + Math.cos(i) * 60, y: cy + Math.sin(i) * 60 };
    });
    const bg = all.filter((n) => !n.cluster);
    bg.forEach((n, i) => {
      const a = (i / bg.length) * Math.PI * 2;
      positions[n.id] = { x: 520 + Math.cos(a) * 360, y: 360 + Math.sin(a) * 240 };
    });
    return positions;
  }, [extraNodes]);

  const allEdges = [...clusterEdges, ...extraEdges];
  const visibleEdges = filter === "flagged" ? allEdges.filter((e) => e.flagged) : allEdges;

  const nodes: Node[] = [...clusterNodes, ...extraNodes].map((n) => {
    const cluster = n.cluster;
    const isSel = selected === n.id;
    const color = cluster === "Alpha" ? "#FF3D6E" : cluster === "Bravo" ? "#F59E0B" : cluster?.startsWith("Sim-") ? "#22D3EE" : "#6B7290";
    return {
      id: n.id,
      position: layout[n.id] ?? { x: 0, y: 0 },
      data: { label: n.studentId.slice(-6) },
      style: {
        background: cluster ? `${color}22` : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${cluster ? color : "rgba(255,255,255,0.12)"}`,
        color: "#F4F6FB",
        borderRadius: 999,
        padding: "8px 12px",
        fontSize: 10,
        fontFamily: "Inter",
        boxShadow: isSel ? `0 0 0 3px ${color}33, 0 0 24px ${color}55` : undefined,
      },
    };
  });

  const edges: Edge[] = visibleEdges.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    animated: e.flagged,
    style: {
      stroke: e.flagged ? "#FF3D6E" : "rgba(255,255,255,0.1)",
      strokeWidth: e.flagged ? 1.4 : 1,
    },
    markerEnd: e.flagged ? { type: MarkerType.ArrowClosed, color: "#FF3D6E" } : undefined,
  }));

  const selectedNode = [...clusterNodes, ...extraNodes].find((n) => n.id === selected);
  const selCentre = selectedNode ? centres.find((c) => c.id === selectedNode.centreId) : null;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <SectionHeading
        eyebrow="Pattern Investigator"
        title="Forensic graph of cross-centre collusion"
        subtitle="Force-directed clustering surfaces coordinated answer patterns, leak propagation, and proxy rings — before they reach the leaderboard."
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter(filter === "all" ? "flagged" : "all")}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white hover:bg-white/[0.06]"
            >
              <Filter className="h-3 w-3" /> {filter === "all" ? "Show flagged only" : "Show all"}
            </button>
            <button onClick={() => useTruthLensStore.getState().startReplay()} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-3 py-1.5 text-[11px] font-semibold text-[#0B1020]">
              <Play className="h-3 w-3" /> Timeline playback
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <GlassPanel className="col-span-12 lg:col-span-8 p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-[color:var(--color-hairline)] p-3 px-4">
            <div className="flex items-center gap-2 text-xs text-white"><GitBranch className="h-3.5 w-3.5 text-[color:var(--color-accent-2)]" /> Collusion graph · NEET Mock 2026</div>
            <div className="flex items-center gap-3 text-[10px] text-[color:var(--color-text-subtle)]">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Cluster Alpha</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Cluster Bravo</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Simulated</span>
            </div>
          </div>
          <div className="h-[640px] w-full" style={{ background: "radial-gradient(ellipse at center, rgba(124,123,255,0.08), transparent 60%)" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodesDraggable
              fitView
              fitViewOptions={{ padding: 0.15 }}
              onNodeClick={(_, node) => setSelected(node.id)}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="rgba(255,255,255,0.05)" gap={28} />
              <Controls className="!bg-white/5 !border-white/10" />
            </ReactFlow>
          </div>
        </GlassPanel>

        <GlassPanel className="col-span-12 lg:col-span-4 p-5">
          {selectedNode ? (
            <motion.div key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">Node selected</div>
              <div className="mt-1 font-display text-xl font-semibold text-white">{selectedNode.studentId}</div>
              <div className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">{selCentre?.name} · {selCentre?.city}</div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="Leak probability" value={`${Math.round(selectedNode.similarity * 100)}%`} tone={selectedNode.cluster ? "bad" : "ok"} />
                <Stat label="Cluster" value={selectedNode.cluster ?? "None"} tone={selectedNode.cluster ? "warn" : "ok"} />
                <Stat label="Cluster score" value={selectedNode.cluster ? "0.88" : "0.12"} tone={selectedNode.cluster ? "bad" : "ok"} />
                <Stat label="Suggested action" value={selectedNode.cluster ? "Escalate" : "Monitor"} tone={selectedNode.cluster ? "bad" : "ok"} />
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]"><Brain className="h-3 w-3" /> AI explanation</div>
                <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">
                  {selectedNode.cluster
                    ? `This student shares ${Math.round(selectedNode.similarity * 100)}% of answer patterns and timing distribution with ${selectedNode.cluster === "Alpha" ? "3" : "2"} other candidates at ${selCentre?.city}. Mean inter-question delay deviates 2.4σ from cohort. Recommend escalating to invigilator-led review.`
                    : "Behavioural fingerprint is within cohort norms. No coordinated answer pattern detected. Continue passive monitoring."}
                </p>
              </div>

              {selectedNode.cluster && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-[11px] text-rose-200">
                  <AlertOctagon className="h-4 w-4 text-rose-300" />
                  Human reviewer escalation suggested. No auto-disqualification.
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    useTruthLensStore.getState().pushTimeline({ label: `Escalated ${selectedNode.studentId}`, detail: "to human reviewer", tone: "warn" });
                    import("sonner").then(({ toast }) => toast.success(`Escalated ${selectedNode.studentId}`));
                  }}
                  className="flex-1 rounded-md bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-3 py-2 text-xs font-semibold text-[#0B1020]"
                >
                  Escalate to reviewer
                </button>
                <button
                  onClick={() => {
                    const note = prompt("Investigation note:");
                    if (note) {
                      useTruthLensStore.getState().pushTimeline({ label: `Note · ${selectedNode.studentId}`, detail: note, tone: "info" });
                      import("sonner").then(({ toast }) => toast("Note added"));
                    }
                  }}
                  className="rounded-md border border-[color:var(--color-hairline)] px-3 py-2 text-xs text-white hover:bg-white/[0.04]"
                >
                  Add note
                </button>
              </div>
            </motion.div>
          ) : <div className="text-sm text-[color:var(--color-text-muted)]">Select a node to inspect.</div>}
        </GlassPanel>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "bad" }) {
  const color = tone === "bad" ? "text-rose-300" : tone === "warn" ? "text-amber-300" : "text-emerald-300";
  return (
    <div className="rounded-lg border border-[color:var(--color-hairline)] bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-subtle)]">{label}</div>
      <div className={`mt-1 font-display text-sm font-semibold ${color}`}>{value}</div>
    </div>
  );
}
