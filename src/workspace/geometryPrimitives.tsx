import type { ReactNode } from "react";
import { integritySummary } from "./geo";
import type {
  GeometryDiagnostics,
  RenderBBoxModel,
  RenderLabelModel,
  RenderNodeModel,
  RenderOverlayModel,
  RenderRingModel,
  RenderVectorModel,
} from "./types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function labelToneClass(hierarchy: RenderLabelModel["hierarchy"]) {
  if (hierarchy === "measurement") return "text-geometry-reference";
  if (hierarchy === "secondary") return "text-[color:var(--geometry-label-secondary)]";
  return "text-[color:var(--geometry-label-primary)]";
}

export function Panel(props: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-[14px] border border-panel-border bg-panel-bg p-3 backdrop-blur-panel", props.className)}>{props.children}</div>;
}

export function RenderVector(props: { vector: RenderVectorModel }) {
  const { vector } = props;
  return (
    <g>
      {vector.halo ? <path d={vector.path} fill="none" stroke={vector.halo} strokeWidth="6px" opacity={0.35} /> : null}
      <path d={vector.path} fill="none" stroke={vector.stroke} strokeWidth={vector.strokeWidth} strokeDasharray={vector.dashArray} opacity={vector.opacity} />
    </g>
  );
}

export function RenderRing(props: { ring: RenderRingModel }) {
  const { ring } = props;
  return <ellipse cx={ring.cx} cy={ring.cy} rx={ring.rx} ry={ring.ry} fill="none" stroke={ring.stroke} strokeWidth={ring.strokeWidth} opacity={ring.opacity} />;
}

export function RenderNode(props: { node: RenderNodeModel; onClick?: (featureId: string) => void }) {
  const { node, onClick } = props;
  const isTriangle = node.shape === "incident";

  return (
    <button
      type="button"
      onClick={() => (node.featureId && onClick ? onClick(node.featureId) : undefined)}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${node.y}%`, width: isTriangle ? undefined : `${node.sizePx}px`, height: isTriangle ? undefined : `${node.sizePx}px` }}
      aria-label={node.label}
    >
      {isTriangle ? (
        <div
          className="h-0 w-0 border-x-[10px] border-b-[18px] border-x-transparent"
          style={{ borderBottomColor: node.fill, filter: node.halo ? `drop-shadow(0 0 6px ${node.halo})` : undefined }}
        />
      ) : (
        <div
          className="rounded-full border"
          style={{
            width: `${node.sizePx}px`,
            height: `${node.sizePx}px`,
            background: node.fill,
            borderColor: node.stroke,
            boxShadow: node.halo ? `0 0 0 6px ${node.halo}` : undefined,
          }}
        />
      )}
    </button>
  );
}

export function RenderLabel(props: { label: RenderLabelModel }) {
  const { label } = props;
  return (
    <div
      className={cx(
        "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em]",
        labelToneClass(label.hierarchy)
      )}
      style={{ left: `${label.x}%`, top: `${label.y}%`, transform: `translate(-50%, -50%) rotate(${label.rotationDegrees}deg)`, color: label.color }}
    >
      {label.text}
    </div>
  );
}

export function RenderOverlay(props: { overlay: RenderOverlayModel }) {
  const { overlay } = props;

  if (overlay.type === "feature-path") {
    return (
      <g>
        {overlay.halo ? <path d={overlay.path} fill="none" stroke={overlay.halo} strokeWidth="6px" opacity={0.2} /> : null}
        <path d={overlay.path} fill={overlay.fill ?? "none"} stroke={overlay.stroke} strokeWidth={overlay.strokeWidth} opacity={overlay.opacity} strokeDasharray={overlay.dashArray} />
      </g>
    );
  }

  if (overlay.type === "screen-box") {
    return (
      <div
        className="absolute border"
        style={{
          left: `${overlay.x}%`,
          top: `${overlay.y}%`,
          width: `${overlay.width}%`,
          height: `${overlay.height}%`,
          borderColor: overlay.borderColor,
          borderWidth: `${overlay.borderWidth}px`,
          boxShadow: overlay.glow ? `0 0 18px ${overlay.glow}` : undefined,
        }}
      />
    );
  }

  if (overlay.type === "crosshair") {
    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d={`M${overlay.x - overlay.size},${overlay.y} L${overlay.x + overlay.size},${overlay.y} M${overlay.x},${overlay.y - overlay.size} L${overlay.x},${overlay.y + overlay.size}`}
          fill="none"
          stroke={overlay.stroke}
          strokeWidth={overlay.strokeWidth}
          opacity={overlay.opacity}
        />
      </svg>
    );
  }

  if (overlay.type === "marker") {
    return (
      <div className="pointer-events-none absolute -translate-x-1/2" style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}>
        <div className="mx-auto h-7 w-px" style={{ background: overlay.stemColor }} />
        <div className="mt-1 rounded-sm border border-panel-border bg-panel-bg px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: overlay.color }}>
          {overlay.text}
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: `${overlay.x}%`,
        top: `${overlay.y}%`,
        width: `${overlay.width}px`,
        height: `${overlay.height}px`,
        border: `${overlay.borderWidth}px ${overlay.borderStyle} ${overlay.borderColor}`,
        opacity: overlay.opacity,
        background: overlay.fill,
        filter: overlay.blurPx ? `blur(${overlay.blurPx}px)` : undefined,
        transform: overlay.transform ? `translate(-50%, -50%) ${overlay.transform}` : "translate(-50%, -50%)",
      }}
    />
  );
}

export function GeometryDebugOverlay(props: {
  diagnostics: GeometryDiagnostics;
  bbox: RenderBBoxModel;
  vectors: RenderVectorModel[];
  labels: RenderLabelModel[];
  rings: RenderRingModel[];
}) {
  const { diagnostics, bbox, vectors, labels, rings } = props;

  return (
    <>
      <div className="pointer-events-none absolute left-4 top-4 z-30 max-w-[280px]">
        <Panel className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Geometry Integrity</div>
          <div className="text-sm font-semibold text-zinc-100">{integritySummary(diagnostics.integrityScore)}</div>
          <div className="text-[11px] text-zinc-300">BBox Source: {bbox.source.toUpperCase()}</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300">
            {Object.entries(diagnostics.integrityScore.breakdown).map(([key, value]) => (
              <div key={key} className="rounded-md border border-zinc-800/70 bg-black/20 px-2 py-1">
                <div className="uppercase tracking-[0.16em] text-zinc-500">{key}</div>
                <div className="mt-1 text-zinc-100">{value}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="pointer-events-none absolute inset-[4%] z-20 border border-dashed border-geometry-reference/35" />

      {vectors.flatMap((vector) => [vector.start, vector.end]).map((point, index) => (
        <div
          key={`vector-endpoint-${index}-${point.x}-${point.y}`}
          className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-geometry-reference bg-black/70"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        />
      ))}

      {labels.map((label) => (
        <div
          key={`label-anchor-${label.id}`}
          className="pointer-events-none absolute z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-geometry-active"
          style={{ left: `${label.anchorX}%`, top: `${label.anchorY}%` }}
        />
      ))}

      {rings.map((ring) => (
        <div
          key={`ring-radius-${ring.id}`}
          className="pointer-events-none absolute text-[10px] font-mono uppercase tracking-[0.18em] text-geometry-reference"
          style={{ left: `${ring.cx + ring.rx}%`, top: `${ring.cy}%` }}
        >
          {(ring.radiusMeters / 1000).toFixed(0)}km
        </div>
      ))}

      {diagnostics.violations.length ? (
        <div className="pointer-events-none absolute bottom-4 left-4 z-30 max-w-[360px]">
          <Panel className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Violations</div>
            {diagnostics.violations.map((violation) => (
              <div key={`${violation.type}-${violation.objectId}`} className="text-[11px] text-zinc-300">
                <span className="mr-2 text-geometry-active">{violation.objectId}</span>
                {violation.reason}
              </div>
            ))}
          </Panel>
        </div>
      ) : null}
    </>
  );
}
