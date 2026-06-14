# TruthLens — Full Rebuild Plan

Complete teardown of the current implementation and rebuild from zero as a premium, dark-mode, intelligence-platform experience modelled after Palantir Gotham / Linear / Vercel / Apple Vision Pro.

## Scope

**Delete entirely:**
- All files under `src/components/{common,dashboard,demo,layout}`
- All existing app routes: `_app.tsx`, `_app.index.tsx`, `_app.enrolment.tsx`, `_app.investigator.tsx`, `_app.live-monitor.tsx`, `_app.reports.tsx`, `_app.settings.tsx`
- Current store, mock data, and the legacy plan file
- All custom CSS color tokens — replaced with new dark-only system

**Keep:** shadcn primitives (`src/components/ui/*`), router bootstrap (`__root.tsx`, `router.tsx`), TanStack config, Tailwind v4 setup.

## Routes (file-based, TanStack Router)

| File | URL | Purpose |
|------|-----|---------|
| `src/routes/index.tsx` | `/` | Cinematic landing experience |
| `src/routes/_shell.tsx` | (layout) | Floating nav + page transitions + Demo FAB |
| `src/routes/_shell.command-centre.tsx` | `/command-centre` | Ops centre with India threat map |
| `src/routes/_shell.identity-vault.tsx` | `/identity-vault` | 3-stage enrolment workflow |
| `src/routes/_shell.live-guard.tsx` | `/live-guard` | SOC live monitor |
| `src/routes/_shell.pattern-investigator.tsx` | `/pattern-investigator` | React Flow collusion graph |
| `src/routes/_shell.audit-intelligence.tsx` | `/audit-intelligence` | Board-ready report viewer |
| `src/routes/_shell.settings.tsx` | `/settings` | Modular control centre |

Each child route uses `head()` for unique meta. `_shell` route renders `<FloatingNav /> + <Outlet /> + <DemoFab />`. Route isolation is enforced by TanStack Router — only the active leaf mounts. Page transitions via `framer-motion` + `AnimatePresence` keyed on `pathname` with `initial={false}`.

## Design System (dark-only)

Rewrite `src/styles.css`:
- Backgrounds: `#0B1020` (base), `#111827` (raised), `#1A1F36` (panel)
- Accent gradients: violet→cyan, amber→rose for risk
- Glass panels: `backdrop-blur-xl`, `bg-white/[0.03]`, `border-white/[0.06]` (0.5px feel), `rounded-xl`
- Shadows: layered, soft, premium
- Fonts loaded via `<link>` in `__root.tsx`: Space Grotesk (display), Inter (body); tokens `--font-display`, `--font-sans` in `@theme`
- Semantic tokens: `--color-bg-base/raised/panel`, `--color-accent`, `--color-success`, `--color-warning`, `--color-danger`, `--color-text-primary/muted/subtle`, `--color-border-hairline`

## Key Components (new tree)

```
src/components/
  shell/
    FloatingNav.tsx        # Vision-Pro-style adaptive drawer (hover-expand, sticky left)
    PageTransition.tsx     # motion fade+slide wrapper
    DemoFab.tsx            # bottom-right floating button + modal
    GlassPanel.tsx         # base panel primitive
  landing/
    Hero.tsx               # left content + CTAs + trust badges
    IndiaIntelVisual.tsx   # animated SVG India map + pulses + live feed
  command/
    MissionBar.tsx
    ThreatMap.tsx          # interactive India map with drill-down
    AnomalyTimeline.tsx    # SOC-style live timeline
    OpsInsights.tsx        # privacy/sync/fairness/integrity rings
    QuickActions.tsx
  identity/
    EnrolmentFlow.tsx      # 3-stage animated stepper with connectors
    BiometricStage.tsx
    ZKPVisualisation.tsx
  liveguard/
    CandidateMonitor.tsx   # face/gaze/objects/timeline
    GazeHeatmap.tsx
    AlertsPanel.tsx
    ReviewQueue.tsx
  investigator/
    CollusionGraph.tsx     # React Flow force-directed, draggable
    GraphSidePanel.tsx     # leak prob, cluster score, AI explanation
    TimelinePlayback.tsx
  audit/
    ReportDocument.tsx     # "FOR OFFICIAL USE ONLY" doc preview
    IntegrityScoreRing.tsx
  settings/
    SettingsGroups.tsx     # modular cards: centres, thresholds, sync, claude, biometrics, fairness, DPDP, logs
  primitives/
    AnimatedCounter.tsx
    PulseDot.tsx
    RiskBadge.tsx
    SectionHeading.tsx
    SkeletonBlock.tsx
```

## State (Zustand)

`src/store/useTruthLensStore.ts` — single store with:
- `liveAnomalies`, `pushAnomaly(type)` (used by Demo FAB + auto-tick)
- `centres`, `sessions`, `clusters`, `reviewQueue`, `auditFindings`
- `simulatedClusterCount` for investigator "leak cluster" demo

## Mock Data

`src/data/mock.ts` — realistic Indian context:
- 3000 students (generated, sampled for display)
- 38 centres across major cities with capacity, status, risk
- 143 live sessions (paginated/virtualised view)
- 12 seed anomalies, 2 collusion clusters (Centre 12 / Centre 07), audit findings, review queue items

## Dependencies to add

- `reactflow` — graph
- `framer-motion` — already? verify, add if missing
- `zustand` — already? verify
- `recharts` — sparkline/confidence trends

(Will check `package.json` and only `bun add` what's missing.)

## Demo FAB

Fixed bottom-right, always mounted via `_shell`. Click opens glass modal with 5 simulate buttons (Phone detected, Second person, Suspicious gaze, Proxy attempt, Leak cluster). Each dispatches into Zustand → updates Live Guard alerts, Command Centre timeline, Investigator (Leak cluster adds 3 flagged questions + new cluster), toast confirmation.

## Microinteractions

- Animated counters on landing + command centre stats
- Hover-expand FloatingNav (240ms ease)
- Skeleton blocks on first paint per route
- Pulse dots on live indicators
- Smooth page transitions (opacity + 8px y)
- Cmd+K command palette (basic, jumps between routes)

## Out of scope (explicit)

- No backend / Lovable Cloud
- No auth
- No PDF generation (Audit page shows polished on-screen preview + "Export PDF" button that toasts "Demo: would download report")
- No real geocoding (India map is a hand-tuned SVG with positioned dots, not Leaflet)

## Build order

1. Delete legacy files + reset `styles.css` + add deps in one batch
2. Add fonts to `__root.tsx`, write primitives + GlassPanel + FloatingNav + DemoFab + store + mock data
3. Build `_shell` layout + landing page
4. Build Command Centre, Identity Vault, Live Guard
5. Build Pattern Investigator (React Flow) + Audit + Settings
6. Verify build, screenshot each route, polish

## Verification

After build: open each of `/`, `/command-centre`, `/identity-vault`, `/live-guard`, `/pattern-investigator`, `/audit-intelligence`, `/settings` in preview, screenshot, confirm no cross-route bleed, confirm Demo FAB works.
