import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { SURFACE_CONFIG_BY_MODE } from "./config";
import { integritySummary } from "./geo";
import { EOOverlayView, FlatMapView, OpsWallView, Site3DView, Theater3DView } from "./SurfaceViews";
import { Panel } from "./geometryPrimitives";
import { useWorkspaceState } from "./useWorkspaceState";
import type { SurfaceViewProps, WorkspaceMode } from "./types";

const VIEW_COMPONENTS = {
  "flat-map": FlatMapView,
  "eo-overlay": EOOverlayView,
  "site-3d": Site3DView,
  "theater-3d": Theater3DView,
  "ops-wall": OpsWallView,
} satisfies Record<WorkspaceMode, ComponentType<SurfaceViewProps>>;

export default function WorkspaceQaPage() {
  const workspace = useWorkspaceState();

  if (!import.meta.env.DEV) {
    return (
      <div className="min-h-screen bg-surface-canvas p-8 text-text-primary">
        <Panel className="max-w-xl">
          <div className="text-sm uppercase tracking-[0.18em] text-zinc-500">Geometry QA</div>
          <div className="mt-2 text-lg font-semibold">This route is development-only.</div>
          <Link to="/workspace" className="mt-4 inline-flex text-sm text-geometry-reference">
            Return to workspace
          </Link>
        </Panel>
      </div>
    );
  }

  const baseProps = {
    selectedFeature: workspace.selectedFeature,
    geometryScene: workspace.geometryScene,
    debugGeometry: true,
    setSelectedId: workspace.setSelectedId,
  };

  return (
    <div className="min-h-screen bg-surface-canvas p-4 text-text-primary md:p-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Dev Only</div>
            <h1 className="mt-2 text-2xl font-semibold">Surface QA Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-text-secondary">
              All five surfaces render from one geometry scene. The overlay shows anchors, ring logic, score breakdown, and any semantic drift.
            </p>
          </div>
          <Panel className="min-w-[260px]">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Integrity Score</div>
            <div className="mt-2 text-lg font-semibold text-zinc-100">{integritySummary(workspace.geometryScene.diagnostics.integrityScore)}</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono">
              {Object.entries(workspace.geometryScene.diagnostics.integrityScore.breakdown).map(([label, value]) => (
                <div key={label} className="rounded-md border border-zinc-800/80 bg-black/20 px-2 py-1">
                  <div className="uppercase tracking-[0.16em] text-zinc-500">{label}</div>
                  <div className="mt-1 text-zinc-100">{value}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {(Object.keys(VIEW_COMPONENTS) as WorkspaceMode[]).map((mode) => {
            const View = VIEW_COMPONENTS[mode];
            return (
              <Panel key={mode} className="p-0 overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{mode}</div>
                    <div className="mt-1 text-sm font-semibold text-zinc-100">{SURFACE_CONFIG_BY_MODE[mode].camera} / {SURFACE_CONFIG_BY_MODE[mode].lighting}</div>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{workspace.geometryScene.diagnostics.integrityScore.overall}%</div>
                </div>
                <div className="relative h-[340px] overflow-hidden">
                  <View {...baseProps} surfaceConfig={SURFACE_CONFIG_BY_MODE[mode]} />
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
