import type { ReactNode } from "react";
import {
  ArrowRight,
  Crosshair,
  Eye,
  EyeOff,
  Focus,
  Layers3,
  LocateFixed,
  Monitor,
  Plus,
  Search,
  TimerReset,
} from "lucide-react";
import { motion } from "framer-motion";
import { AUXILIARY_RAIL_ICONS, LAYERS, SCREEN_FAMILY_BY_ID, SCREEN_FAMILY_SPECS } from "./config";
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

interface SharedShellProps extends WorkspaceShellProps {
  currentSurface: (typeof SCREEN_FAMILY_SPECS)[number];
}

function SurfaceModeTabs(props: { workspaceMode: WorkspaceMode; onSetWorkspaceMode: (mode: WorkspaceMode) => void; compact?: boolean }) {
  const { workspaceMode, onSetWorkspaceMode, compact } = props;

  return (
    <div className={cx("flex min-w-0 flex-wrap gap-1.5", compact && "gap-1")}>
      {SCREEN_FAMILY_SPECS.map((spec) => {
        const active = spec.id === workspaceMode;
        return (
          <button
            key={spec.id}
            type="button"
            onClick={() => onSetWorkspaceMode(spec.id)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.16em] transition",
              compact ? "px-2 py-1 text-[10px]" : "",
              active ? "border-[#d1b16d]/60 bg-[#272414] text-[#e7cf89]" : "border-zinc-700/90 bg-[#12130f]/88 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100"
            )}
          >
            <spec.Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            {spec.shortName}
          </button>
        );
      })}
    </div>
  );
}

function ExtentButtons(props: { extentMode: ExtentMode; onSetExtentMode: (mode: ExtentMode) => void; compact?: boolean; vertical?: boolean }) {
  const { extentMode, onSetExtentMode, compact, vertical } = props;

  return (
    <div className={cx("flex gap-1.5", vertical ? "flex-col" : "flex-wrap")}>
      {[
        { label: "Selection", icon: Crosshair, mode: "selection" as const },
        { label: "Compare", icon: LocateFixed, mode: "compare" as const },
        { label: "Operational", icon: TimerReset, mode: "operational" as const },
      ].map(({ label, icon: Icon, mode }) => {
        const active = extentMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onSetExtentMode(mode)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.16em] transition",
              compact && "px-2 py-1 text-[10px]",
              active ? "border-[#d1b16d]/60 bg-[#272414] text-[#e7cf89]" : "border-zinc-700/90 bg-[#12130f]/88 text-zinc-400 hover:border-zinc-500 hover:text-zinc-100"
            )}
          >
            <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function LayerToggleRow(props: { visibleLayers: Record<string, boolean>; onToggleLayer: (layerId: string) => void; compact?: boolean }) {
  const { visibleLayers, onToggleLayer, compact } = props;
  return (
    <div className="flex min-w-0 flex-wrap gap-1.5">
      {LAYERS.map((layer) => {
        const active = visibleLayers[layer.id];
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onToggleLayer(layer.id)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.16em] transition",
              compact && "px-2 py-1 text-[10px]",
              active ? "border-zinc-700 bg-[#171812] text-zinc-100" : "border-zinc-800 bg-[#10110d] text-zinc-500"
            )}
          >
            {active ? <Eye className="h-3 w-3 text-[#ef8f45]" /> : <EyeOff className="h-3 w-3" />}
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchField(props: { query: string; onQueryChange: (value: string) => void; placeholder?: string }) {
  const { query, onQueryChange, placeholder } = props;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-[#0f100c]/92 px-2.5 py-2">
      <Search className="h-3.5 w-3.5 text-zinc-500" />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={placeholder ?? "Search IDs, labels, regions"}
        className="w-full min-w-0 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
      />
    </div>
  );
}

function SelectedDetailBlock(props: { selectedFeature: Feature; comparedIds: string[]; onToggleCompare: (id: string) => void; condensed?: boolean }) {
  const { selectedFeature, comparedIds, onToggleCompare, condensed } = props;

  return (
    <div className={cx("rounded-[14px] border border-zinc-700/80 bg-[#11120f]/92 backdrop-blur-sm", condensed ? "p-3" : "p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Selected Object</div>
          <div className="mt-1 truncate text-base font-medium text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
          <div className="mt-1 truncate text-sm text-zinc-400">{selectedFeature.properties.labelSecondary}</div>
        </div>
        <span className={cx(CLS.pill, statusClasses(selectedFeature.properties.operationalState))}>{selectedFeature.properties.operationalState}</span>
      </div>
      <div className={cx("grid gap-2", condensed ? "mt-3 grid-cols-2" : "mt-4 grid-cols-2")}>
        {[
          ["ID", selectedFeature.properties.id],
          ["Type", selectedFeature.properties.entityType],
          ["Region", selectedFeature.properties.regionCode],
          ["Confidence", selectedFeature.properties.confidence],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-zinc-800 bg-[#181914] px-2.5 py-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
            <div className="mt-1 text-sm font-medium text-zinc-100">{value}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{selectedFeature.properties.summary}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{selectedFeature.properties.timeLabel}</div>
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
    </div>
  );
}

function MapShell(props: SharedShellProps) {
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
    currentSurface,
    renderMainSurface,
    onQueryChange,
    onToggleCompare,
    onSelectFeature,
    onToggleLayer,
    onSetExtentMode,
    onSetWorkspaceMode,
  } = props;

  return (
    <div className="min-h-screen bg-[#0f100d] text-zinc-100">
      <div className="mx-auto min-h-screen w-full max-w-[1760px] p-3 md:p-4">
        <div className="overflow-hidden rounded-[30px] border border-zinc-800 bg-[#151611] shadow-workspace-xl">
          <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[minmax(290px,22%)_minmax(0,54%)_minmax(320px,24%)]">
            <aside className="border-b border-zinc-800 bg-[#181914] p-4 xl:border-b-0 xl:border-r">
              <div className="mb-4 flex items-center gap-2">
                {AUXILIARY_RAIL_ICONS.slice(0, 4).map((Icon, index) => (
                  <div
                    key={index}
                    className={cx(
                      "flex h-10 w-10 items-center justify-center rounded-lg border",
                      index === 0 ? "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]" : "border-zinc-800 bg-[#12130f] text-zinc-500"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                ))}
              </div>

              <div>
                <div className={CLS.meta}>Operational Index</div>
                <div className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">Intelligence Workspace</div>
                <div className="mt-1 text-sm text-zinc-400">Flat-map remains the review-heavy truth surface with persistent index and dossier.</div>
              </div>

              <SurfaceCard className="mt-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-200">
                    <Monitor className="h-4 w-4 text-[#d1b16d]" />
                    Screen Families
                  </div>
                  <div className={CLS.meta}>System</div>
                </div>
                <div className="space-y-2">
                  {SCREEN_FAMILY_SPECS.map((spec) => {
                    const active = spec.id === workspaceMode;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => onSetWorkspaceMode(spec.id)}
                        className={cx(
                          "w-full rounded-lg border p-3 text-left transition",
                          active ? "border-[#d1b16d]/60 bg-[#232116]" : "border-zinc-800 bg-[#141510] hover:border-zinc-700"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cx(CLS.iconChip, active ? "border-[#d1b16d]/50 bg-[#2a2618] text-[#e4c97f]" : "border-zinc-700 bg-[#141510] text-zinc-400")}>
                            <spec.Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium text-zinc-100">{spec.name}</div>
                              <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{spec.compareRole}</div>
                            </div>
                            <div className="mt-1 text-[12px] text-zinc-400">{spec.question}</div>
                            <div className="mt-2 text-[12px] leading-5 text-zinc-300">{spec.behaviorSummary}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </SurfaceCard>

              <div className="mt-4 space-y-3">
                <DossierCard className="p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-zinc-200">Search</div>
                    <div className={CLS.meta}>Object</div>
                  </div>
                  <SearchField query={query} onQueryChange={onQueryChange} />
                </DossierCard>

                <DossierCard className="p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-zinc-200">Active Layers</div>
                    <div className={CLS.meta}>Scope</div>
                  </div>
                  <LayerToggleRow visibleLayers={visibleLayers} onToggleLayer={onToggleLayer} />
                </DossierCard>
              </div>

              <DossierCard className="mt-4 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm text-zinc-200">Objects</div>
                  <div className={CLS.meta}>{dossierCards.length} visible</div>
                </div>
                <div className="space-y-2 overflow-auto pr-1 xl:max-h-[calc(100vh-470px)]">
                  {dossierCards.map((feature) => {
                    const selected = feature.properties.id === selectedFeature.properties.id;
                    const compared = comparedIds.includes(feature.properties.id);
                    return (
                      <motion.div layout key={feature.properties.id} onClick={() => onSelectFeature(feature.properties.id)} className={selected ? CLS.objectCardSelected : CLS.objectCardDefault}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className={CLS.meta}>{feature.properties.id}</div>
                            <div className="mt-0.5 truncate text-sm font-medium text-zinc-100">{feature.properties.labelPrimary}</div>
                            <div className="mt-0.5 truncate text-[12px] text-zinc-400">{feature.properties.labelSecondary}</div>
                          </div>
                          <span className={cx(CLS.pill, statusClasses(feature.properties.operationalState))}>{feature.properties.operationalState}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="truncate text-[11px] uppercase tracking-[0.16em] text-zinc-500">{feature.properties.timeLabel}</div>
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

            <main className="border-b border-zinc-800 bg-[#12130f] xl:border-b-0 xl:border-r">
              <div className="border-b border-zinc-800 px-4 py-3">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div className="min-w-0">
                    <div className={CLS.meta}>Surface</div>
                    <div className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">{currentSurface.name}</div>
                    <div className="mt-1 text-sm text-zinc-300">{currentSurface.question}</div>
                  </div>
                  <div className="min-w-0 xl:max-w-[60%] xl:text-right">
                    <div className={CLS.meta}>Selected Object</div>
                    <div className="mt-1 text-sm font-medium text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
                    <div className="mt-1 text-[12px] uppercase tracking-[0.16em] text-zinc-500">{selectedFeature.properties.id} · {selectedFeature.properties.regionCode}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-[#161712] p-3">
                  <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                    <div className="text-sm text-zinc-300">{topBarSubtitle(workspaceMode)}</div>
                    <ExtentButtons extentMode={extentMode} onSetExtentMode={onSetExtentMode} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["Visible Objects", `${visibleFeaturesCount}`],
                      ["Compared Items", `${comparedIds.length}`],
                      ["Active BBox", activeBBox],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-zinc-700/80 bg-[#11120f] px-3 py-2">
                        <div className={CLS.meta}>{label}</div>
                        <div className="mt-1 text-sm font-medium text-zinc-100">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative min-h-[540px] overflow-hidden xl:min-h-[calc(100vh-178px)]">
                {renderMainSurface()}
              </div>
            </main>

            <aside className="bg-[#181914] p-4">
              <SelectedDetailBlock selectedFeature={selectedFeature} comparedIds={comparedIds} onToggleCompare={onToggleCompare} />

              <DossierCard className="mt-4 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Evidence</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{selectedFeature.properties.evidenceRefs.length}</div>
                </div>
                <div className="space-y-2">
                  {selectedFeature.properties.evidenceRefs.map((ref) => (
                    <div key={ref} className={CLS.dossierSection}>
                      <div className="text-sm text-zinc-100">{ref}</div>
                      <div className="mt-1 text-[12px] text-zinc-500">Linked to selection, compare scope, and shared geometry context.</div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              <DossierCard className="mt-4 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Compare Queue</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{comparedFeatures.length}</div>
                </div>
                <div className="space-y-2">
                  {comparedFeatures.length ? (
                    comparedFeatures.map((feature) => (
                      <CompareCard key={feature.properties.id}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm text-zinc-100">{feature.properties.labelPrimary}</div>
                            <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{feature.properties.id} · {feature.properties.entityType}</div>
                          </div>
                          <button type="button" onClick={() => onToggleCompare(feature.properties.id)} className={cx(CLS.pill, CLS.pillDefault)}>
                            Remove
                          </button>
                        </div>
                      </CompareCard>
                    ))
                  ) : (
                    <CompareCard>
                      <div className="text-sm text-zinc-500">No pinned compare items yet.</div>
                    </CompareCard>
                  )}
                </div>
              </DossierCard>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneShell(props: SharedShellProps) {
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
    currentSurface,
    renderMainSurface,
    onQueryChange,
    onToggleCompare,
    onSelectFeature,
    onToggleLayer,
    onSetExtentMode,
    onSetWorkspaceMode,
  } = props;

  const compactObjects = dossierCards.slice(0, 5);
  const toolIcons = [Focus, Layers3, Crosshair, LocateFixed];

  return (
    <div className="min-h-screen bg-[#0a0b08] text-zinc-100">
      <div className="border-b border-zinc-800 bg-[#0f100c]/96 px-3 py-2.5 backdrop-blur-xl md:px-4">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#b0bf63]/35 bg-black/55 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-100">
              <span className="text-zinc-500">Selected</span>
              <span className="font-medium">{selectedFeature.properties.labelPrimary}</span>
              <span className="text-zinc-500">{selectedFeature.properties.entityType}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-black/45 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
              Aimpoints ({Math.max(comparedIds.length, 1)}x)
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-md border border-[#b0bf63]/45 bg-[#212414]/92 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#d6dd7b]">
              Task Asset
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex min-w-0 flex-col gap-2 xl:items-end">
            <SurfaceModeTabs workspaceMode={workspaceMode} onSetWorkspaceMode={onSetWorkspaceMode} compact />
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{currentSurface.name} · {currentSurface.geometryBehavior}</div>
          </div>
        </div>
      </div>

      <div className="relative lg:h-[calc(100vh-69px)]">
        <div className="relative min-h-[64vh] overflow-hidden lg:h-full">
          {renderMainSurface()}

          <div className="absolute right-4 top-4 hidden lg:flex flex-col gap-2">
            {toolIcons.map((Icon, index) => (
              <button
                key={index}
                type="button"
                className={cx(
                  "flex h-11 w-11 items-center justify-center border text-sm transition",
                  index < 2 ? "border-[#b0bf63]/50 bg-[#242715]/80 text-[#d6dd7b]" : "border-zinc-700/90 bg-[#10110d]/88 text-zinc-200"
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
            <div className="mt-2 flex flex-col items-center rounded-full border border-[#b0bf63]/50 bg-[#11120f]/90 px-2 py-3 text-zinc-100">
              <div className="text-[14px] font-medium">N</div>
              <div className="my-2 h-10 w-px bg-zinc-500/40" />
              <div className="text-sm">0°</div>
            </div>
            <ExtentButtons extentMode={extentMode} onSetExtentMode={onSetExtentMode} compact vertical />
          </div>

          <div className="absolute bottom-5 left-5 hidden w-[320px] lg:block">
            <div className="rounded-[16px] border border-zinc-700/85 bg-[#0f100c]/92 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Operational Index</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{visibleFeaturesCount} visible</div>
              </div>
              <SearchField query={query} onQueryChange={onQueryChange} placeholder="Search task objects" />
              <div className="mt-2">
                <LayerToggleRow visibleLayers={visibleLayers} onToggleLayer={onToggleLayer} compact />
              </div>
              <div className="mt-3 space-y-1.5">
                {compactObjects.map((feature) => {
                  const selected = feature.properties.id === selectedFeature.properties.id;
                  const compared = comparedIds.includes(feature.properties.id);
                  return (
                    <button
                      key={feature.properties.id}
                      type="button"
                      onClick={() => onSelectFeature(feature.properties.id)}
                      className={cx(
                        "flex w-full items-start justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition",
                        selected ? "border-[#d1b16d]/60 bg-[#232116]" : "border-zinc-800 bg-[#141510] hover:border-zinc-700"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-100">{feature.properties.labelPrimary}</div>
                        <div className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-zinc-500">{feature.properties.id}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {compared ? <span className={cx(CLS.pill, CLS.pillActive)}>Pinned</span> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 hidden w-[340px] lg:block">
            <SelectedDetailBlock selectedFeature={selectedFeature} comparedIds={comparedIds} onToggleCompare={onToggleCompare} condensed />
          </div>
        </div>

        <div className="grid gap-3 border-t border-zinc-800 bg-[#10110d] p-3 lg:hidden">
          <SelectedDetailBlock selectedFeature={selectedFeature} comparedIds={comparedIds} onToggleCompare={onToggleCompare} condensed />

          <div className="rounded-[14px] border border-zinc-700/80 bg-[#11120f]/92 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Operational Index</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{visibleFeaturesCount}</div>
            </div>
            <SearchField query={query} onQueryChange={onQueryChange} placeholder="Search task objects" />
            <div className="mt-2">
              <LayerToggleRow visibleLayers={visibleLayers} onToggleLayer={onToggleLayer} compact />
            </div>
            <div className="mt-3 space-y-1.5">
              {compactObjects.map((feature) => (
                <button
                  key={feature.properties.id}
                  type="button"
                  onClick={() => onSelectFeature(feature.properties.id)}
                  className={cx(
                    "w-full rounded-lg border px-2.5 py-2 text-left text-sm transition",
                    feature.properties.id === selectedFeature.properties.id ? "border-[#d1b16d]/60 bg-[#232116] text-zinc-100" : "border-zinc-800 bg-[#141510] text-zinc-200"
                  )}
                >
                  {feature.properties.labelPrimary}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-zinc-700/80 bg-[#11120f]/92 p-3">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">Geometry Controls</div>
            <ExtentButtons extentMode={extentMode} onSetExtentMode={onSetExtentMode} />
            <div className="mt-3 text-sm text-zinc-300">{topBarSubtitle(workspaceMode)}</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-zinc-500">BBox {activeBBox}</div>
          </div>

          {comparedFeatures.length ? (
            <div className="rounded-[14px] border border-zinc-700/80 bg-[#11120f]/92 p-3">
              <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">Compare Queue</div>
              <div className="space-y-2">
                {comparedFeatures.map((feature) => (
                  <CompareCard key={feature.properties.id}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-100">{feature.properties.labelPrimary}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{feature.properties.id}</div>
                      </div>
                      <button type="button" onClick={() => onToggleCompare(feature.properties.id)} className={cx(CLS.pill, CLS.pillDefault)}>
                        Remove
                      </button>
                    </div>
                  </CompareCard>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OpsWallShell(props: SharedShellProps) {
  const {
    selectedFeature,
    comparedIds,
    comparedFeatures,
    dossierCards,
    visibleFeaturesCount,
    activeBBox,
    workspaceMode,
    renderMainSurface,
    onToggleCompare,
    onSelectFeature,
    onSetWorkspaceMode,
  } = props;

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="border-b border-zinc-800 bg-[#060606] px-3 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          {["MEXICO", "NEPAL", "ALGIERS", "ARCTIC", "MADRID", "DUBAI", "CAIRO", "SEOUL"].map((city, index) => (
            <div key={city} className="min-w-[88px] rounded-md border border-zinc-800 bg-black px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{city}</div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-red-500">{String((19 + index) % 24).padStart(2, "0")}:30</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
          <div className="inline-flex min-w-0 items-center gap-3 rounded-md border border-zinc-700 bg-[#0a0a0a] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-200">
            <span className="text-zinc-500">Selected</span>
            <span className="font-medium">{selectedFeature.properties.labelPrimary}</span>
            <span className="text-zinc-500">Mission Wall</span>
          </div>
          <SurfaceModeTabs workspaceMode={workspaceMode} onSetWorkspaceMode={onSetWorkspaceMode} compact />
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-122px)] grid-cols-1 gap-3 p-3 xl:grid-cols-[260px_minmax(0,1fr)_260px]">
        <div className="space-y-3">
          {["Mission Queue", "Asset Status", "Alerts"].map((panel) => (
            <div key={panel} className="rounded-[16px] border border-zinc-800 bg-[#0e1012] p-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{panel}</div>
              <div className="mt-3 space-y-2">
                {dossierCards.slice(0, 3).map((feature) => (
                  <button
                    key={`${panel}-${feature.properties.id}`}
                    type="button"
                    onClick={() => onSelectFeature(feature.properties.id)}
                    className="w-full rounded-lg border border-zinc-800 bg-black/45 px-2.5 py-2 text-left"
                  >
                    <div className="text-sm text-zinc-100">{feature.properties.labelPrimary}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{feature.properties.operationalState}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[18px] border border-zinc-800 bg-[#090909]">
          {renderMainSurface()}
        </div>

        <div className="space-y-3">
          <div className="rounded-[16px] border border-zinc-800 bg-[#0e1012] p-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Wall Analytics</div>
            <div className="mt-3 grid gap-2">
              {[
                ["Visible", `${visibleFeaturesCount}`],
                ["Compare", `${comparedIds.length}`],
                ["BBox", activeBBox],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-zinc-800 bg-black/45 px-2.5 py-2">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
                  <div className="mt-1 text-sm text-zinc-100">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-zinc-800 bg-[#0e1012] p-3">
            <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">Compare Queue</div>
            <div className="space-y-2">
              {comparedFeatures.length ? (
                comparedFeatures.map((feature) => (
                  <CompareCard key={feature.properties.id}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-100">{feature.properties.labelPrimary}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">{feature.properties.id}</div>
                      </div>
                      <button type="button" onClick={() => onToggleCompare(feature.properties.id)} className={cx(CLS.pill, CLS.pillDefault)}>
                        Remove
                      </button>
                    </div>
                  </CompareCard>
                ))
              ) : (
                <CompareCard>
                  <div className="text-sm text-zinc-500">No compare items pinned.</div>
                </CompareCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceShell(props: WorkspaceShellProps) {
  const currentSurface = SCREEN_FAMILY_BY_ID[props.workspaceMode];

  if (currentSurface.shellTemplate === "scene") {
    return <SceneShell {...props} currentSurface={currentSurface} />;
  }

  if (currentSurface.shellTemplate === "ops-wall") {
    return <OpsWallShell {...props} currentSurface={currentSurface} />;
  }

  return <MapShell {...props} currentSurface={currentSurface} />;
}
