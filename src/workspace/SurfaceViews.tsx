import { surfaceCardTone } from "./geo";
import { GeometryDebugOverlay, Panel, RenderLabel, RenderNode, RenderOverlay, RenderRing, RenderVector } from "./geometryPrimitives";
import { CLS } from "./styles";
import type { SurfaceViewProps, SurfaceRenderScene, WorkspaceMode } from "./types";

function SurfaceCaption(props: { eyebrow: string; title: string; accentClass?: string }) {
  const { eyebrow, title, accentClass } = props;
  return (
    <div className="pointer-events-none absolute left-5 top-5 z-20">
      <Panel className="px-3 py-2">
        <div className={accentClass ?? CLS.surfaceMeta}>{eyebrow}</div>
        <div className={CLS.surfaceTitle}>{title}</div>
      </Panel>
    </div>
  );
}

function SurfaceTelemetry(props: { title: string; values: Array<[string, string]>; className?: string }) {
  const { title, values, className } = props;
  return (
    <div className={`pointer-events-none absolute z-20 ${className ?? ""}`}>
      <Panel>
        <div className={CLS.surfaceMeta}>{title}</div>
        <div className="mt-2 space-y-1.5">
          {values.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-[11px] font-mono text-zinc-300">
              <span className="uppercase tracking-[0.16em] text-zinc-500">{label}</span>
              <span className="text-zinc-100">{value}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function GridOverlay(props: { subtle?: boolean; className?: string }) {
  return (
    <div
      className={`absolute inset-0 ${props.className ?? ""}`}
      style={{
        opacity: props.subtle ? 0.1 : 0.16,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: props.subtle ? "48px 48px" : "56px 56px",
      }}
    />
  );
}

function SurfaceBackground(props: SurfaceViewProps["surfaceConfig"]) {
  const tone = surfaceCardTone(props);
  return <div className="absolute inset-0" style={{ background: tone.background }} />;
}

function SceneRenderer(props: {
  scene: SurfaceRenderScene;
  onSelectFeature: (id: string) => void;
}) {
  const { scene, onSelectFeature } = props;
  const svgOverlays = scene.overlays.filter((overlay) => overlay.type === "feature-path" || overlay.type === "crosshair");
  const htmlOverlays = scene.overlays.filter((overlay) => overlay.type !== "feature-path" && overlay.type !== "crosshair");

  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {svgOverlays.map((overlay) => (
          <RenderOverlay key={overlay.id} overlay={overlay} />
        ))}
        {scene.rings.map((ring) => (
          <RenderRing key={ring.id} ring={ring} />
        ))}
        {scene.vectors.map((vector) => (
          <RenderVector key={vector.id} vector={vector} />
        ))}
      </svg>

      {htmlOverlays.map((overlay) => (
        <RenderOverlay key={overlay.id} overlay={overlay} />
      ))}

      {scene.nodes.map((node) => (
        <RenderNode key={node.id} node={node} onClick={onSelectFeature} />
      ))}

      {scene.labels.map((label) => (
        <RenderLabel key={label.id} label={label} />
      ))}
    </>
  );
}

function useSurfaceScene(props: SurfaceViewProps, mode: WorkspaceMode) {
  return props.geometryScene.surfaces[mode];
}

export function FlatMapView(props: SurfaceViewProps) {
  const scene = useSurfaceScene(props, "flat-map");

  return (
    <>
      <SurfaceBackground {...props.surfaceConfig} />
      <GridOverlay subtle />
      <div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,rgba(255,200,87,0.08),transparent)]" />
      <SceneRenderer scene={scene} onSelectFeature={props.setSelectedId} />
      <SurfaceCaption eyebrow="Truth Surface" title="BBox Fit / Geometry-Led" />
      <SurfaceTelemetry
        title="Reference Logic"
        className="bottom-5 left-5"
        values={[
          ["Camera", props.surfaceConfig.camera],
          ["Grid", props.surfaceConfig.gridVisible ? "VISIBLE" : "HIDDEN"],
          ["Selection", props.selectedFeature.properties.id],
        ]}
      />
      {props.debugGeometry ? <GeometryDebugOverlay diagnostics={scene.diagnostics} bbox={scene.bbox} vectors={scene.vectors} labels={scene.labels} rings={scene.rings} /> : null}
    </>
  );
}

export function EOOverlayView(props: SurfaceViewProps) {
  const scene = useSurfaceScene(props, "eo-overlay");

  return (
    <>
      <SurfaceBackground {...props.surfaceConfig} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,10,0.92)_0%,rgba(7,9,10,0.24)_14%,rgba(7,9,10,0.24)_86%,rgba(7,9,10,0.92)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[18%] bg-[linear-gradient(180deg,rgba(4,6,7,0.94),transparent)]" />
      <GridOverlay subtle />
      <SceneRenderer scene={scene} onSelectFeature={props.setSelectedId} />
      <SurfaceCaption eyebrow="EO Exploitation" title={props.selectedFeature.properties.labelPrimary} accentClass="text-[10px] uppercase tracking-[0.18em] text-geometry-reference/80" />
      <SurfaceTelemetry
        title="Sensor Feed"
        className="right-5 top-5 min-w-[180px]"
        values={[
          ["Track", props.selectedFeature.properties.id],
          ["Lighting", props.surfaceConfig.lighting],
          ["State", props.selectedFeature.properties.operationalState.toUpperCase()],
        ]}
      />
      <SurfaceTelemetry
        title="Directional Gate"
        className="bottom-5 left-5 min-w-[190px]"
        values={[
          ["Reference", "BLUE / FRAME"],
          ["Selection", "AMBER / LOCK"],
          ["Mode", "EXPLOIT / COLD"],
        ]}
      />
      {props.debugGeometry ? <GeometryDebugOverlay diagnostics={scene.diagnostics} bbox={scene.bbox} vectors={scene.vectors} labels={scene.labels} rings={scene.rings} /> : null}
    </>
  );
}

export function Site3DView(props: SurfaceViewProps) {
  const scene = useSurfaceScene(props, "site-3d");

  return (
    <>
      <SurfaceBackground {...props.surfaceConfig} />
      <div className="absolute inset-x-0 top-[34%] h-px bg-geometry-reference/16" />
      <GridOverlay className="left-[-20%] top-[35%] h-[110%] w-[140%] opacity-15" />
      <SceneRenderer scene={scene} onSelectFeature={props.setSelectedId} />
      <SurfaceCaption eyebrow="Local Surface" title="Oblique Site Inspection" />
      <SurfaceTelemetry
        title="Local Frame"
        className="right-5 top-5 min-w-[180px]"
        values={[
          ["Selected", props.selectedFeature.properties.id],
          ["Axis", props.surfaceConfig.camera.toUpperCase()],
          ["Depth", props.surfaceConfig.groundPlaneVisible ? "LOCKED / 01" : "OFF"],
        ]}
      />
      {props.debugGeometry ? <GeometryDebugOverlay diagnostics={scene.diagnostics} bbox={scene.bbox} vectors={scene.vectors} labels={scene.labels} rings={scene.rings} /> : null}
    </>
  );
}

export function Theater3DView(props: SurfaceViewProps) {
  const scene = useSurfaceScene(props, "theater-3d");

  return (
    <>
      <SurfaceBackground {...props.surfaceConfig} />
      <div className="absolute left-[-10%] top-[40%] h-[96%] w-[134%] rounded-[54px] border border-white/5 opacity-40" style={{ transform: "perspective(1200px) rotateX(71deg)" }} />
      <div className="absolute inset-x-0 top-0 h-[18%] bg-[linear-gradient(180deg,rgba(5,6,5,0.78),transparent)]" />
      <SceneRenderer scene={scene} onSelectFeature={props.setSelectedId} />
      <SurfaceCaption eyebrow="Theater Surface" title="Mission Geometry / Vectors" />
      <SurfaceTelemetry
        title="Theater Grid"
        className="right-5 top-5 min-w-[180px]"
        values={[
          ["Selected", props.selectedFeature.properties.id],
          ["Rings", `${scene.rings.length} / sync`],
          ["Vectors", `${scene.vectors.length} / active`],
        ]}
      />
      <div className="pointer-events-none absolute bottom-5 left-5">
        <Panel className="px-3 py-2">
          <div className={CLS.surfaceMeta}>Scale Logic</div>
          <div className="mt-2 flex gap-4 text-[11px] font-mono text-zinc-300">
            <span>32km STEP</span>
            <span className="text-geometry-reference">REFERENCE BLUE</span>
            <span className="text-geometry-active">ACTIVE AMBER</span>
          </div>
        </Panel>
      </div>
      {props.debugGeometry ? <GeometryDebugOverlay diagnostics={scene.diagnostics} bbox={scene.bbox} vectors={scene.vectors} labels={scene.labels} rings={scene.rings} /> : null}
    </>
  );
}

export function OpsWallView(props: SurfaceViewProps) {
  const scene = useSurfaceScene(props, "ops-wall");

  return (
    <div className="absolute inset-0 overflow-hidden bg-surface-canvas">
      <SurfaceBackground {...props.surfaceConfig} />
      <GridOverlay />
      <div className="absolute inset-x-[8%] top-[12%] bottom-[10%] border border-zinc-800/80 bg-[rgba(6,8,10,0.85)] shadow-[0_60px_160px_rgba(0,0,0,0.6)]">
        <div className="absolute left-4 top-4 border-l-2 border-t-2 border-zinc-700/50 p-2 text-[10px] uppercase tracking-widest text-zinc-500">Wall / Alpha-01</div>
        <div className="absolute right-4 top-4 border-r-2 border-t-2 border-zinc-700/50 p-2 text-right text-[10px] uppercase tracking-widest text-zinc-500">Ext: {scene.nodes.length} Active</div>
        <div className="absolute inset-x-[12%] top-[14%] flex items-center justify-between border-y border-zinc-800/70 bg-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          {["T-12", "T-08", "T-03", "Live", "T+02"].map((tick) => (
            <div key={tick} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-geometry-active/60" />
              {tick}
            </div>
          ))}
        </div>

        <SceneRenderer scene={scene} onSelectFeature={props.setSelectedId} />

        <div className="absolute left-[8%] top-[25%] space-y-4">
          {[
            { label: "Link Sync", value: "Locked", color: "text-accent-verified" },
            { label: "Telemetry", value: "Nominal", color: "text-accent-verified" },
            { label: "Queue", value: "Active", color: "text-geometry-active" },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-zinc-700 pl-3">
              <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">{stat.label}</div>
              <div className={`mt-0.5 text-xs font-medium uppercase tracking-wider ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="absolute right-[8%] top-[25%] space-y-4">
          {[
            { label: "Zone", value: props.selectedFeature.properties.regionCode, color: "text-zinc-100" },
            { label: "Priority", value: props.selectedFeature.properties.priority.toUpperCase(), color: "text-geometry-active" },
            { label: "Confidence", value: props.selectedFeature.properties.confidence.toUpperCase(), color: "text-geometry-reference" },
          ].map((stat) => (
            <div key={stat.label} className="border-r border-zinc-700 pr-3 text-right">
              <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">{stat.label}</div>
              <div className={`mt-0.5 text-xs font-medium uppercase tracking-wider ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[22%] left-[12%] right-[12%] grid grid-cols-3 gap-3">
          {[
            ["Route Sync", `${scene.vectors.length} vectors`],
            ["Wall State", "Aggregation"],
            ["Sector", props.selectedFeature.properties.regionCode],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-zinc-800/80 bg-black/20 px-3 py-2">
              <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-12">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Mission Object</div>
            <div className="mt-1 text-base font-semibold text-zinc-100">{props.selectedFeature.properties.labelPrimary}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Global Monitoring</div>
            <div className="mt-1 text-base font-semibold text-geometry-active">Sector Alert</div>
          </div>
        </div>
      </div>
      {props.debugGeometry ? <GeometryDebugOverlay diagnostics={scene.diagnostics} bbox={scene.bbox} vectors={scene.vectors} labels={scene.labels} rings={scene.rings} /> : null}
    </div>
  );
}
