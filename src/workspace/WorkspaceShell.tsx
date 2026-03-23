import type { ReactNode } from "react";
import { Crosshair, Eye, EyeOff, LocateFixed, Monitor, Plus, Search, TimerReset } from "lucide-react";
import { motion } from "framer-motion";
import { AUXILIARY_RAIL_ICONS, LAYERS, SCREEN_FAMILY_BY_ID, SCREEN_FAMILY_SPECS, WORKSPACE_INVARIANTS } from "./config";
import { statusClasses, topBarSubtitle } from "./geo";
import { CompareCard, DossierCard, SurfaceCard } from "./cardPrimitives";
import { CLS } from "./styles";
import type { ExtentMode, Feature, WorkspaceMode } from "./types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface WorkspaceShellProps {
  query: string;
  selectedFeature: Feature;
  comparedIds: string[];
  comparedFeatures: Feature[];
  dossierCards: Feature[];
  visibleLayers: Record<string, boolean>;
  visibleFeaturesCount: number;
  activeBBox: string;
  extentMode: ExtentMode;
  workspaceMode: WorkspaceMode;
  renderMainSurface: () => ReactNode;
  onQueryChange: (value: string) => void;
  onToggleCompare: (id: string) => void;
  onToggleLayer: (layerId: string) => void;
  onSelectFeature: (id: string) => void;
  onSetExtentMode: (mode: ExtentMode) => void;
  onSetWorkspaceMode: (mode: WorkspaceMode) => void;
}

export function WorkspaceShell(props: WorkspaceShellProps) {
  const {
    query,
    selectedFeature,
    comparedIds,
    comparedFeatures,
    dossierCards,
    visibleLayers,
    visibleFeaturesCount,
    activeBBox,
    extentMode,
    workspaceMode,
    renderMainSurface,
    onQueryChange,
    onToggleCompare,
    onSelectFeature,
    onToggleLayer,
    onSetExtentMode,
    onSetWorkspaceMode,
  } = props;

  const currentSurface = SCREEN_FAMILY_BY_ID[workspaceMode];

  return (
    <div className="min-h-screen bg-[#11120f] text-zinc-100">
      <div className="mx-auto min-h-screen w-full max-w-[1760px] p-3 md:p-4">
        <div className="overflow-hidden rounded-shell border border-zinc-800 bg-[#161713] shadow-workspace-xl">
          <div className="grid min-h-[100vh] grid-cols-1 gap-0 lg:items-start lg:grid-cols-[280px_minmax(0,1fr)_320px] xl:grid-cols-[minmax(288px,22vw)_minmax(0,1fr)_minmax(320px,24vw)] 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
            <aside className="order-1 flex min-w-0 flex-col gap-3 border-b border-zinc-800 bg-[#181914] p-3 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-start gap-2 border-b border-zinc-800 pb-3">
                <div className="flex flex-1 flex-wrap gap-1.5">
                  {AUXILIARY_RAIL_ICONS.map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      className={cx(
                        "flex h-10 w-10 items-center justify-center rounded-lg border transition",
                        i === 0
                          ? "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]"
                          : "border-zinc-800 bg-[#12130f] text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <div className="rounded-lg border border-zinc-800 bg-[#12130f] px-2 py-1 text-center text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                  Geo Core
                </div>
              </div>

              <div>
                <div className={CLS.meta}>Operational Index</div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-100">Intelligence Workspace</div>
                <div className="mt-0.5 text-label text-zinc-400">Product shell for shared object identity across five screen families.</div>
              </div>

              <SurfaceCard className="min-h-0">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-label text-zinc-200">
                    <Monitor className="h-3.5 w-3.5 text-[#d1b16d]" /> Screen Families
                  </div>
                  <div className={CLS.meta}>System view</div>
                </div>
                <div className="space-y-2">
                  {SCREEN_FAMILY_SPECS.map((spec) => {
                    const active = workspaceMode === spec.id;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => onSetWorkspaceMode(spec.id)}
                        className={cx(
                          "w-full rounded-lg border p-3 text-left transition",
                          active ? "border-[#d1b16d] bg-[#232116]" : "border-zinc-800 bg-[#181914] hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cx(CLS.iconChip, active ? "border-[#d1b16d]/50 bg-[#2a2618] text-[#e4c97f]" : "border-zinc-700 bg-[#141510] text-zinc-400")}>
                            <spec.Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-body font-medium text-zinc-100">{spec.name}</div>
                              <div className="text-meta-sm uppercase text-zinc-500">{spec.compareRole}</div>
                            </div>
                            <div className="mt-1 text-label text-zinc-400">{spec.role}</div>
                            <div className="mt-2 text-[12px] leading-4 text-zinc-300">{spec.behaviorSummary}</div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {WORKSPACE_INVARIANTS.map((invariant) => (
                                <span key={invariant} className="rounded-full border border-zinc-700 bg-[#141510] px-2 py-0.5 text-meta-xs uppercase text-zinc-300">
                                  {invariant}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </SurfaceCard>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
                <DossierCard className="min-h-[96px]">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-label text-zinc-200">Search</div>
                    <div className={CLS.meta}>Object</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#11120f] px-2.5 py-2">
                    <Search className="h-3.5 w-3.5 text-zinc-500" />
                    <input
                      value={query}
                      onChange={(event) => onQueryChange(event.target.value)}
                      placeholder="Search IDs, region codes, titles"
                      className="w-full min-w-0 bg-transparent text-label text-zinc-100 outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </DossierCard>

                <DossierCard className="min-h-[96px]">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-label text-zinc-200">Active Layers</div>
                    <div className={CLS.meta}>Scope</div>
                  </div>
                  <div className="space-y-1">
                    {LAYERS.map((layer) => {
                      const active = visibleLayers[layer.id];
                      return (
                        <button
                          key={layer.id}
                          type="button"
                          onClick={() => onToggleLayer(layer.id)}
                          className={cx(
                            "flex w-full items-center justify-between rounded-md border px-2.5 py-1.5 text-label transition",
                            active ? "border-zinc-700 bg-[#1b1c16] text-zinc-100" : "border-zinc-900 bg-[#12130f] text-zinc-500"
                          )}
                        >
                          <span>{layer.label}</span>
                          {active ? <Eye className="h-3.5 w-3.5 text-[#ef8f45]" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </DossierCard>
              </div>

              <DossierCard className="min-h-[88px] lg:flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-label text-zinc-200">Operational Index</div>
                  <div className={CLS.meta}>{dossierCards.length} visible</div>
                </div>
                <div className="space-y-1.5 overflow-auto pr-1 lg:max-h-[420px] xl:max-h-[520px] 2xl:max-h-[600px]">
                  {dossierCards.map((feature) => {
                    const selected = feature.properties.id === selectedFeature.properties.id;
                    const compared = comparedIds.includes(feature.properties.id);
                    return (
                      <motion.div
                        layout
                        key={feature.properties.id}
                        onClick={() => onSelectFeature(feature.properties.id)}
                        className={selected ? CLS.objectCardSelected : CLS.objectCardDefault}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className={CLS.meta}>{feature.properties.id}</div>
                            <div className="mt-0.5 truncate text-body-sm font-medium text-zinc-100">{feature.properties.labelPrimary}</div>
                            <div className="mt-0.5 truncate text-label text-zinc-400">{feature.properties.labelSecondary}</div>
                          </div>
                          <span className={cx(CLS.pill, statusClasses(feature.properties.operationalState))}>{feature.properties.operationalState}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="truncate text-meta-sm text-zinc-500">{feature.properties.timeLabel}</div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onToggleCompare(feature.properties.id);
                            }}
                            className={cx(CLS.pill, compared ? CLS.pillActive : CLS.pillDefault)}
                          >
                            {compared ? "Pinned" : "Compare"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </DossierCard>
            </aside>

            <main className="order-2 flex min-w-0 flex-col border-b border-zinc-800 bg-[#151611] lg:border-b-0 lg:border-r">
              <div className="border-b border-zinc-800 px-4 py-3">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div className="min-w-0">
                    <div className={CLS.meta}>Surface</div>
                    <div className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">{currentSurface.name}</div>
                    <div className="mt-1 text-body-sm text-zinc-300">{currentSurface.question}</div>
                  </div>
                  <div className="min-w-0 text-left xl:max-w-[48%] xl:text-right">
                    <div className={CLS.meta}>Selected Object</div>
                    <div className="mt-1 text-body font-medium text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
                    <div className="mt-1 text-label text-zinc-400">{selectedFeature.properties.id} · {selectedFeature.properties.regionCode}</div>
                  </div>
                </div>

                <DossierCard className="mt-3 min-h-[88px] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-label text-zinc-200">Region Scope</div>
                    <div className={CLS.meta}>Extent logic</div>
                  </div>
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="text-body-sm text-zinc-300">{topBarSubtitle(workspaceMode)}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Center Selection", icon: Crosshair, mode: "selection" as const },
                        { label: "Frame Compare", icon: LocateFixed, mode: "compare" as const },
                        { label: "Operational Scope", icon: TimerReset, mode: "operational" as const },
                      ].map(({ label, icon: Icon, mode }) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => onSetExtentMode(mode)}
                          className={cx(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-label transition",
                            extentMode === mode ? "border-[#d1b16d] bg-[#232116] text-[#e4c97f]" : "border-zinc-700 bg-[#191a14] text-zinc-200 hover:bg-[#20221a] hover:text-zinc-100"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </DossierCard>
              </div>

              <div className="relative min-h-[520px] overflow-hidden lg:min-h-[600px] xl:min-h-[660px] 2xl:min-h-[720px]">
                {renderMainSurface()}
              </div>

              <div className="flex flex-wrap gap-1.5 border-t border-zinc-800 bg-[#13140f] p-2.5">
                {[
                  { label: "Visible Objects", value: `${visibleFeaturesCount}`, note: "Current operational scope" },
                  { label: "Compared Items", value: `${comparedIds.length}`, note: "Pinned for compare bbox" },
                  { label: "Active BBox", value: activeBBox, note: `Mode: ${extentMode}` },
                ].map((stat) => (
                  <div key={stat.label} className={CLS.statusBarCard}>
                    <div className={CLS.meta}>{stat.label}</div>
                    <div className="mt-0.5 text-body-sm font-semibold tracking-tight text-zinc-100">{stat.value}</div>
                    <div className="mt-0.5 text-meta-sm text-zinc-400">{stat.note}</div>
                  </div>
                ))}
              </div>
            </main>

            <aside className="order-3 flex min-w-0 flex-col gap-3 bg-[#191a15] p-3">
              <DossierCard className="min-h-[88px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className={CLS.meta}>Dossier</div>
                    <div className="mt-0.5 text-base font-semibold leading-tight tracking-tight text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
                    <div className="mt-1 text-label text-zinc-400">{selectedFeature.properties.labelSecondary}</div>
                  </div>
                  <span className={cx(CLS.pill, statusClasses(selectedFeature.properties.operationalState))}>{selectedFeature.properties.operationalState}</span>
                </div>
              </DossierCard>

              <DossierCard className="min-h-[120px]">
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    ["ID", selectedFeature.properties.id],
                    ["Type", selectedFeature.properties.entityType],
                    ["Priority", selectedFeature.properties.priority],
                    ["Freshness", selectedFeature.properties.freshness],
                    ["Confidence", selectedFeature.properties.confidence],
                    ["Region", selectedFeature.properties.regionCode],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-zinc-800 bg-[#181914] p-3">
                      <div className={CLS.meta}>{label}</div>
                      <div className="mt-0.5 text-label font-medium text-zinc-100">{value}</div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              <DossierCard className="min-h-[120px]">
                <div className={CLS.meta}>Summary</div>
                <p className="mt-2 text-label leading-5 text-zinc-300">{selectedFeature.properties.summary}</p>
              </DossierCard>

              <DossierCard className="min-h-[120px]">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Evidence</div>
                  <button
                    type="button"
                    onClick={() => onToggleCompare(selectedFeature.properties.id)}
                    className={cx(CLS.pill, comparedIds.includes(selectedFeature.properties.id) ? CLS.pillActive : CLS.pillDefault)}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Plus className="h-2.5 w-2.5" />
                      {comparedIds.includes(selectedFeature.properties.id) ? "Pinned" : "Pin Compare"}
                    </span>
                  </button>
                </div>
                <div className="space-y-1">
                  {selectedFeature.properties.evidenceRefs.map((ref) => (
                    <div key={ref} className="rounded-lg border border-zinc-800 bg-[#181914] p-3">
                      <div className="text-label text-zinc-100">{ref}</div>
                      <div className="mt-0.5 text-meta-sm text-zinc-500">Linked to selection and geometry context</div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              <DossierCard className="min-h-[64px]">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Compare Queue</div>
                  <div className="text-meta-sm uppercase text-zinc-500">{comparedFeatures.length}</div>
                </div>
                <div className="space-y-1">
                  {comparedFeatures.length ? (
                    comparedFeatures.map((feature) => (
                      <CompareCard key={feature.properties.id}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-label text-zinc-100">{feature.properties.labelPrimary}</div>
                            <div className="mt-0.5 text-meta-sm text-zinc-500">{feature.properties.id} · {feature.properties.entityType}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onToggleCompare(feature.properties.id)}
                            className={cx(CLS.pill, CLS.pillDefault)}
                          >
                            Remove
                          </button>
                        </div>
                      </CompareCard>
                    ))
                  ) : (
                    <CompareCard>
                      <div className="text-label text-zinc-500">No compared items yet. Use compare actions in the index or dossier.</div>
                    </CompareCard>
                  )}
                </div>
              </DossierCard>

              <DossierCard className="min-h-[120px]">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Behavior Spine</div>
                  <div className="text-meta-sm uppercase text-zinc-500">Persistent</div>
                </div>
                <div className="space-y-1">
                  {[
                    "Selection propagates across object card, primary surface, and dossier.",
                    "Extent mode reframes by operational, selection, or compare scope without resetting state.",
                    "Mode switches preserve object identity while changing the surface language.",
                  ].map((item) => (
                    <CompareCard key={item}>
                      <div className="text-label text-zinc-300">{item}</div>
                    </CompareCard>
                  ))}
                </div>
              </DossierCard>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
