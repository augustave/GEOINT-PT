import type { ReactNode } from "react";
import {
  ArrowRight,
  Crosshair,
  Eye,
  EyeOff,
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
    <div className={cx("rounded-[14px] bg-[rgba(10,10,10,0.72)] backdrop-blur-[12px] border border-white/[0.06]", condensed ? "p-3" : "p-4")}>
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

function UnifiedTopBar(props: SharedShellProps) {
  const { 
    selectedFeature, 
    comparedIds, 
    workspaceMode, 
    onSetWorkspaceMode,
    currentSurface
  } = props;

  return (
    <div className="border-b border-zinc-800 bg-[#0d0e0a] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Cluster: Identity + Task */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#d1b16d]/40 bg-[#1a1811] px-2.5 py-1.5 shadow-[0_0_10px_rgba(209,177,109,0.1)]">
            <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Selected</span>
            <span className="text-sm font-semibold text-[#e7cf89] truncate max-w-[180px]">{selectedFeature.properties.labelPrimary}</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
             <div className="h-4 w-px bg-zinc-800 mx-1" />
             <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
               {selectedFeature.properties.id} · {selectedFeature.properties.regionCode}
             </div>
             <div className="h-4 w-px bg-zinc-800 mx-1" />
             <div className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-black/40 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-400">
               Aimpoints ({Math.max(comparedIds.length, 1)}x)
             </div>
             <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-[#b0bf63]/40 bg-[#1b1e11] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#d6dd7b] hover:border-[#b0bf63]">
               Task Asset
             </button>
          </div>
        </div>

        {/* Right Cluster: Surface Switcher */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-[10px] uppercase tracking-[0.18em] text-zinc-500 md:block">Surface Family</div>
          <SurfaceModeTabs workspaceMode={workspaceMode} onSetWorkspaceMode={onSetWorkspaceMode} compact />
        </div>
      </div>

      {/* Subheader: Surface Context */}
      <div className="mt-3 flex items-center justify-between border-t border-zinc-800/50 pt-2.5">
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ef8f45]">
            {currentSurface.name.toUpperCase()} · {currentSurface.geometryBehavior.toUpperCase()}
          </div>
          <div className="text-[12px] text-zinc-400 hidden lg:block">
            {currentSurface.question}
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          Intelligence Workspace v2.0
        </div>
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
    renderMainSurface,
    onQueryChange,
    onToggleCompare,
    onSelectFeature,
    onToggleLayer,
    onSetExtentMode,
  } = props;

  return (
    <div className="min-h-screen bg-[#0f100d] text-zinc-100">
      <div className="mx-auto min-h-screen w-full max-w-[1760px] p-3 md:p-4">
        <div className="overflow-hidden rounded-[30px] border border-zinc-800 bg-[#151611] shadow-workspace-xl">
          <UnifiedTopBar {...props} />
          <div className="grid min-h-[calc(100vh-120px)] grid-cols-1 xl:grid-cols-[minmax(290px,22%)_minmax(0,54%)_minmax(320px,24%)]">
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
                <div className="mt-1 text-xl font-semibold tracking-tight text-zinc-100">Field Archive</div>
                <div className="mt-1 text-sm text-zinc-400">Truth surface with persistent index and dossier.</div>
              </div>

              <div className="mt-5 space-y-3">
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

              <DossierCard className="mt-4 p-3 flex-1 overflow-hidden flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm text-zinc-200">Objects</div>
                  <div className={CLS.meta}>{dossierCards.length} visible</div>
                </div>
                <div className="space-y-2 overflow-auto pr-1 flex-1">
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
                 <div className="flex items-center justify-between">
                    <div className="text-sm text-zinc-300">{topBarSubtitle(workspaceMode)}</div>
                    <ExtentButtons extentMode={extentMode} onSetExtentMode={onSetExtentMode} />
                 </div>
                 <div className="mt-3 flex flex-wrap gap-2">
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

              <div className="relative min-h-[540px] overflow-hidden xl:min-h-[calc(100vh-210px)]">
                {renderMainSurface()}
              </div>
            </main>

            <aside className="bg-[#181914] p-4 flex flex-col gap-4 overflow-auto">
              <SelectedDetailBlock selectedFeature={selectedFeature} comparedIds={comparedIds} onToggleCompare={onToggleCompare} />

              <DossierCard className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Evidence</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{selectedFeature.properties.evidenceRefs.length}</div>
                </div>
                <div className="space-y-2">
                  {selectedFeature.properties.evidenceRefs.map((ref) => (
                    <div key={ref} className={CLS.dossierSection}>
                      <div className="text-sm text-zinc-100">{ref}</div>
                      <div className="mt-1 text-[12px] text-zinc-500">Linked to selection and evidence rail.</div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              <DossierCard className="p-3">
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
  } = props;

  const sceneObjects = dossierCards.slice(0, 8);
  const toolIcons = [
    { label: "Focus", icon: Crosshair },
    { label: "Layers", icon: Layers3 },
    { label: "Compare", icon: LocateFixed },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b08] text-zinc-100">
       <div className="mx-auto min-h-screen w-full max-w-[1760px] p-3 md:p-4">
        <div className="overflow-hidden rounded-[30px] border border-zinc-800 bg-[#151611] shadow-workspace-xl">
          <UnifiedTopBar {...props} />
          
          <div className="grid min-h-[calc(100vh-115px)] grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
            <aside className="border-b border-zinc-800 bg-[#181914] p-4 xl:border-b-0 xl:border-r overflow-auto">
              <div className="flex items-center justify-between">
                <div className={CLS.meta}>Operational Index</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{visibleFeaturesCount} visible</div>
              </div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-zinc-100">{currentSurface.name}</div>

              <DossierCard className="mt-4 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-zinc-200">Search</div>
                  <div className={CLS.meta}>Object</div>
                </div>
                <SearchField query={query} onQueryChange={onQueryChange} placeholder="Search task objects" />
              </DossierCard>

              <DossierCard className="mt-3 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-zinc-200">Active Layers</div>
                  <div className={CLS.meta}>Scope</div>
                </div>
                <LayerToggleRow visibleLayers={visibleLayers} onToggleLayer={onToggleLayer} compact />
              </DossierCard>

              <div className="mt-4 space-y-2 overflow-auto pr-1 xl:max-h-[calc(100vh-420px)]">
                {sceneObjects.map((feature) => {
                  const selected = feature.properties.id === selectedFeature.properties.id;
                  const compared = comparedIds.includes(feature.properties.id);
                  return (
                    <button
                      key={feature.properties.id}
                      type="button"
                      onClick={() => onSelectFeature(feature.properties.id)}
                      className={cx(
                        "w-full rounded-lg border px-3 py-2.5 text-left transition",
                        selected ? "border-[#d1b16d]/60 bg-[#232116]" : "border-zinc-800 bg-[#141510] hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-zinc-100">{feature.properties.labelPrimary}</div>
                          <div className="mt-1 truncate text-[11px] uppercase tracking-[0.16em] text-zinc-500">{feature.properties.id} · {feature.properties.entityType}</div>
                        </div>
                        {compared ? <span className={cx(CLS.pill, CLS.pillActive)}>Pinned</span> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <main className="min-w-0 border-b border-zinc-800 bg-[#0b0c09] xl:border-b-0 xl:border-r">
              <div className="grid min-h-[64vh] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_72px] xl:min-h-[calc(100vh-115px)]">
                <div className="relative min-w-0 overflow-hidden border-b border-zinc-800 lg:border-b-0 lg:border-r">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-[linear-gradient(180deg,rgba(5,6,5,0.72),transparent)]" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,rgba(5,6,5,0.78),rgba(5,6,5,0.32),transparent)]" />
                  <div className="absolute right-4 top-4 z-20 rounded-[12px] bg-[rgba(10,10,10,0.72)] p-2 backdrop-blur-[12px] border border-white/[0.06]">
                    <ExtentButtons extentMode={extentMode} onSetExtentMode={onSetExtentMode} vertical compact />
                  </div>
                  {renderMainSurface()}
                </div>
                <aside className="flex items-center justify-between gap-2 bg-[#10110d] p-3 lg:flex-col lg:justify-start">
                  {toolIcons.map(({ label, icon: Icon }, index) => (
                    <button
                      key={label}
                      type="button"
                      className={cx(
                        "flex h-11 w-11 items-center justify-center rounded-md border transition",
                        index === 0 ? "border-[#b0bf63]/50 bg-[#242715] text-[#d6dd7b]" : "border-zinc-700/90 bg-[#12130f] text-zinc-200"
                      )}
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                  <div className="flex items-center gap-3 lg:mt-4 lg:flex-col">
                    <div className="flex flex-col items-center rounded-full border border-[#b0bf63]/40 bg-[#11120f] px-2 py-3 text-zinc-100">
                      <div className="text-[14px] font-medium">N</div>
                      <div className="my-2 h-8 w-px bg-zinc-500/40" />
                      <div className="text-sm">0°</div>
                    </div>
                    <div className="rounded-md border border-zinc-700 bg-[#11120f] px-2 py-1.5 text-[10px] uppercase tracking-[0.16em] text-zinc-400 text-center">
                      BBox
                      <div className="mt-1 text-[9px] leading-3 text-zinc-200 max-w-[60px] truncate">{activeBBox}</div>
                    </div>
                  </div>
                </aside>
              </div>
            </main>

            <aside className="bg-[#181914] p-4 flex flex-col gap-4 overflow-auto">
              <SelectedDetailBlock selectedFeature={selectedFeature} comparedIds={comparedIds} onToggleCompare={onToggleCompare} condensed />

              <DossierCard className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Metadata</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{selectedFeature.properties.timeLabel}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Priority", selectedFeature.properties.priority],
                    ["Freshness", selectedFeature.properties.freshness],
                    ["Confidence", selectedFeature.properties.confidence],
                    ["Region", selectedFeature.properties.regionCode],
                  ].map(([label, value]) => (
                    <div key={label} className={CLS.dossierSection}>
                      <div className={CLS.meta}>{label}</div>
                      <div className="mt-1 text-sm text-zinc-100">{value}</div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              <DossierCard className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Evidence</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{selectedFeature.properties.evidenceRefs.length}</div>
                </div>
                <div className="space-y-2">
                  {selectedFeature.properties.evidenceRefs.map((ref) => (
                    <div key={ref} className={CLS.dossierSection}>
                      <div className="text-sm text-zinc-100">{ref}</div>
                      <div className="mt-1 text-[12px] text-zinc-500">Linked to selection and surface geometry.</div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              <DossierCard className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Compare Queue</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{comparedFeatures.length}</div>
                </div>
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
              </DossierCard>
            </aside>
          </div>
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
       <div className="mx-auto min-h-screen w-full max-w-[1760px] p-3 md:p-4">
        <div className="overflow-hidden rounded-[30px] border border-zinc-800 bg-[#060606] shadow-workspace-xl">
          <div className="mb-3 flex flex-wrap gap-2 px-4 pt-4">
            {["MEXICO", "NEPAL", "ALGIERS", "ARCTIC", "MADRID", "DUBAI", "CAIRO", "SEOUL"].map((city, index) => (
              <div key={city} className="min-w-[88px] rounded-md border border-zinc-800 bg-black px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{city}</div>
                <div className="mt-1 text-xl font-semibold tracking-tight text-red-500">{String((19 + index) % 24).padStart(2, "0")}:30</div>
              </div>
            ))}
          </div>
          <UnifiedTopBar {...props} />
          
          <div className="grid min-h-[calc(100vh-122px)] grid-cols-1 gap-3 p-3 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
            <div className="space-y-3">
              {["Mission Queue", "Asset Status", "Alerts"].map((panel) => (
                <DossierCard key={panel} className="p-3">
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
                </DossierCard>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-[18px] border border-zinc-800 bg-[#090909]">
              {renderMainSurface()}
            </div>

            <aside className="space-y-3 overflow-auto bg-[#12130f] p-1">
              <SelectedDetailBlock selectedFeature={selectedFeature} comparedIds={comparedIds} onToggleCompare={onToggleCompare} condensed />

              <DossierCard className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className={CLS.meta}>Evidence</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{selectedFeature.properties.evidenceRefs.length}</div>
                </div>
                <div className="space-y-2">
                  {selectedFeature.properties.evidenceRefs.map((ref) => (
                    <div key={ref} className={CLS.dossierSection}>
                      <div className="text-sm text-zinc-100">{ref}</div>
                      <div className="mt-1 text-[12px] text-zinc-500">Linked to selection and command aggregation.</div>
                    </div>
                  ))}
                </div>
              </DossierCard>

              <DossierCard className="p-3">
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
              </DossierCard>

              <DossierCard className="p-3">
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
              </DossierCard>
            </aside>
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
