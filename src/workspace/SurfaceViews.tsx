import { styleForFeature, toSvgPath, projectOblique, projectPoint } from "./geo";
import { T } from "./config";
import { CLS } from "./styles";
import type { PointFeature, SurfaceViewProps } from "./types";

function projectToPercent(point: [number, number], bbox: [number, number, number, number], mode: "flat" | "oblique") {
  return mode === "flat" ? projectPoint(point, bbox) : projectOblique(point, bbox);
}

function pointMarkerClass(selected: boolean, alert: boolean) {
  if (selected) {
    return "border-[#f3d87a] bg-[#1a1611] shadow-[0_0_0_8px_rgba(243,216,122,0.14)]";
  }
  if (alert) {
    return "border-[#ef8f45] bg-[#301a0f] shadow-[0_0_0_6px_rgba(239,143,69,0.16)]";
  }
  return "border-[#92d6de] bg-[#102226] shadow-[0_0_0_5px_rgba(95,200,216,0.12)]";
}

function SurfaceCaption(props: { eyebrow: string; title: string; accentClass?: string }) {
  const { eyebrow, title, accentClass } = props;

  return (
    <div className={`pointer-events-none absolute left-4 top-4 ${CLS.surfaceOverlayCard}`}>
      <div className={accentClass ?? CLS.surfaceMeta}>{eyebrow}</div>
      <div className={CLS.surfaceTitle}>{title}</div>
    </div>
  );
}

function SurfaceTelemetry(props: { title: string; values: Array<[string, string]>; className?: string }) {
  const { title, values, className } = props;

  return (
    <div className={`pointer-events-none absolute ${CLS.surfaceOverlayCard} ${className ?? ""}`}>
      <div className={CLS.surfaceMeta}>{title}</div>
      <div className="mt-2 space-y-1.5">
        {values.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-[11px] font-mono text-zinc-300">
            <span className="uppercase tracking-[0.16em] text-zinc-500">{label}</span>
            <span className="text-zinc-100">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlatMapView(props: SurfaceViewProps) {
  const { visibleFeatures, comparedIds, selectedFeature, activeBBox, selectionProjection, setSelectedId } = props;

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(120,120,90,0.11),rgba(8,9,7,0.72)_62%)]" />
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,rgba(209,177,109,0.08),transparent)]" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {visibleFeatures
          .filter((feature) => feature.geometry.type === "Polygon")
          .map((feature) => {
            const style = styleForFeature(feature, {
              selected: feature.properties.id === selectedFeature.properties.id,
              compared: comparedIds.includes(feature.properties.id),
              muted: false,
            });
            return <path key={feature.properties.id} d={toSvgPath(feature, activeBBox)} fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} />;
          })}

        {visibleFeatures
          .filter((feature) => feature.geometry.type === "LineString")
          .map((feature) => {
            const selected = feature.properties.id === selectedFeature.properties.id;
            const style = styleForFeature(feature, {
              selected,
              compared: comparedIds.includes(feature.properties.id),
              muted: false,
            });

            return (
              <g key={feature.properties.id}>
                {selected ? <path d={toSvgPath(feature, activeBBox)} fill="none" stroke={style.halo} strokeWidth={1.4} /> : null}
                <path d={toSvgPath(feature, activeBBox)} fill="none" stroke={style.stroke} strokeWidth={style.strokeWidth} strokeDasharray={style.dashArray} />
              </g>
            );
          })}
      </svg>

      {visibleFeatures
        .filter((feature): feature is PointFeature => feature.geometry.type === "Point")
        .map((feature) => {
          const projected = projectPoint(feature.geometry.coordinates, activeBBox);
          const style = styleForFeature(feature, {
            selected: feature.properties.id === selectedFeature.properties.id,
            compared: comparedIds.includes(feature.properties.id),
            muted: false,
          });

          return (
            <button
              key={feature.properties.id}
              type="button"
              onClick={() => setSelectedId(feature.properties.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
              style={{
                left: `${projected.x}%`,
                top: `${projected.y}%`,
                width: `${style.radius! * 10}px`,
                height: `${style.radius! * 10}px`,
                background: style.fill,
                border: `${style.strokeWidth}px solid ${style.stroke}`,
                boxShadow: `0 0 0 8px ${style.halo}`,
              }}
              aria-label={feature.properties.labelPrimary}
            />
          );
        })}

      <div className="pointer-events-none absolute left-4 top-4 rounded-[12px] border border-white/[0.06] bg-[rgba(10,10,10,0.72)] px-3 py-2 backdrop-blur-[12px]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Truth Surface</div>
        <div className="mt-1 text-sm font-medium text-zinc-100">BBox fit / geometry-led</div>
      </div>

      <div
        className="pointer-events-none absolute rounded-full border border-dashed border-[#d1b16d]/50"
        style={{ left: `${selectionProjection.x}%`, top: `${selectionProjection.y}%`, width: "96px", height: "96px", transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}

export function EOOverlayView(props: SurfaceViewProps) {
  const { incidentFeatures, selectionAnchor, activeBBox, selectedFeature, setSelectedId } = props;
  const selectedProjection = projectPoint(selectionAnchor, activeBBox);
  const rulerTicks = ["-060", "-030", "000", "+030", "+060"];

  return (
    <>
      <div className="absolute inset-0 bg-[#121411]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(54,92,108,0.34),transparent_32%),linear-gradient(180deg,rgba(8,18,23,1)_0%,rgba(10,12,12,1)_54%,rgba(7,8,8,1)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,10,0.92)_0%,rgba(7,9,10,0.24)_14%,rgba(7,9,10,0.24)_86%,rgba(7,9,10,0.92)_100%)]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)", backgroundSize: "100% 2px" }} />
      <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="absolute inset-x-0 top-0 h-[18%] bg-[linear-gradient(180deg,rgba(4,6,7,0.94),transparent)]" />
      <div className="absolute inset-y-0 right-0 w-[18%] bg-[linear-gradient(270deg,rgba(4,6,7,0.82),transparent)]" />

      <div className="pointer-events-none absolute left-[10%] right-[10%] top-[11%] flex items-start justify-between">
        {rulerTicks.map((tick) => (
          <div key={tick} className="flex flex-col items-center gap-1 text-[10px] font-mono text-cyan-400/70">
            <div className="h-3 w-px bg-cyan-400/45" />
            <div>{tick}</div>
          </div>
        ))}
      </div>

      <div className="absolute left-[34%] top-[14%] h-[28%] w-[22%] border border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.1)]" />
      <div className="absolute left-[58%] top-[18%] h-[26%] w-[16%] border border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.1)]" />

      {[
        [44, 46, 13, 7],
        [45, 56, 13, 7],
        [45, 66, 12, 7],
        [38, 81, 18, 8],
      ].map(([x, y, w, h], index) => (
        <div key={`amber-${index}`} className="absolute border border-[#f3d87a]/80" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
          <div className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-[#f3d87a]" />
          <div className="absolute -right-1 -top-1 h-2 w-2 border-r border-t border-[#f3d87a]" />
          <div className="absolute -bottom-1 -left-1 h-2 w-2 border-b border-l border-[#f3d87a]" />
          <div className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-[#f3d87a]" />
        </div>
      ))}

      {[
        [39, 63, 15, 12],
        [52, 60, 17, 14],
        [68, 20, 11, 5],
      ].map(([x, y, w, h], index) => (
        <div key={`blue-${index}`} className="absolute border border-[#5fc8d8]/70" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
           <div className="absolute left-1/2 top-0 h-1 w-px bg-[#5fc8d8]/50" />
           <div className="absolute left-1/2 bottom-0 h-1 w-px bg-[#5fc8d8]/50" />
           <div className="absolute left-0 top-1/2 w-1 h-px bg-[#5fc8d8]/50" />
           <div className="absolute right-0 top-1/2 w-1 h-px bg-[#5fc8d8]/50" />
        </div>
      ))}

      <div className="absolute rounded-full border border-cyan-400/40" style={{ left: `calc(${selectedProjection.x}% - 100px)`, top: `calc(${selectedProjection.y}% - 100px)`, width: "200px", height: "200px" }} />
      <div className="absolute h-[1px] origin-left bg-cyan-400/60" style={{ left: `${selectedProjection.x}%`, top: `${selectedProjection.y}%`, width: "20%", transform: "rotate(-18deg)" }}>
        <div className="absolute right-0 top-[-3px] h-2 w-px bg-cyan-400" />
        <div className="absolute right-0 top-[-4px] h-2 w-2 rotate-45 border-r border-t border-cyan-400/80" />
      </div>
      <div className="absolute h-[1px] origin-left bg-[#f3d87a]/55" style={{ left: `${selectedProjection.x}%`, top: `${selectedProjection.y + 3}%`, width: "14%", transform: "rotate(22deg)" }}>
        <div className="absolute right-0 top-[-4px] h-2 w-2 rotate-45 border-r border-t border-[#f3d87a]/70" />
      </div>
      <div className="absolute text-[11px] font-mono tracking-wider text-cyan-400/90" style={{ left: `calc(${selectedProjection.x}% + 16%)`, top: `calc(${selectedProjection.y}% - 5%)` }}>MEAS: 20.44m</div>
      <div className="absolute text-[10px] font-mono tracking-[0.24em] text-[#f3d87a]/85" style={{ left: `calc(${selectedProjection.x}% + 11%)`, top: `calc(${selectedProjection.y}% + 10%)` }}>AIMPOINT // LOCK</div>

      {([
        [selectedProjection.x + 10, selectedProjection.y - 18, "N"],
        [selectedProjection.x - 10, selectedProjection.y + 15, "S"],
        [selectedProjection.x - 22, selectedProjection.y - 1, "W"],
        [selectedProjection.x + 23, selectedProjection.y + 16, "E"],
      ] as const).map(([x, y, label]) => (
        <div key={label} className="absolute text-[11px] font-mono font-medium text-zinc-400" style={{ left: `${x}%`, top: `${y}%` }}>
          {label}
        </div>
      ))}

      {incidentFeatures.map((feature) => {
        const projected = projectToPercent(feature.geometry.coordinates, activeBBox, "flat");
        const selected = feature.properties.id === selectedFeature.properties.id;
        return (
          <button
            key={feature.properties.id}
            type="button"
            onClick={() => setSelectedId(feature.properties.id)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border ${pointMarkerClass(selected, feature.properties.operationalState === "alert")}`}
            style={{ left: `${projected.x}%`, top: `${projected.y}%`, width: selected ? "16px" : "10px", height: selected ? "16px" : "10px" }}
            aria-label={feature.properties.labelPrimary}
          />
        );
      })}

      <SurfaceCaption eyebrow="EO Exploitation" title={selectedFeature.properties.labelPrimary} accentClass="text-[10px] uppercase tracking-[0.18em] text-cyan-400/70" />
      <SurfaceTelemetry
        title="Sensor Feed"
        className="right-4 top-4 min-w-[180px]"
        values={[
          ["Track", selectedFeature.properties.id],
          ["Vector", "182° / 20.4m"],
          ["State", selectedFeature.properties.operationalState.toUpperCase()],
        ]}
      />
      <SurfaceTelemetry
        title="Directional Gate"
        className="bottom-4 left-4 min-w-[190px]"
        values={[
          ["Reference", "BLUE / FRAME"],
          ["Selection", "AMBER / LOCK"],
          ["Mode", "EXPLOIT / COLD"],
        ]}
      />
    </>
  );
}

export function Site3DView(props: SurfaceViewProps) {
  const { visibleFeatures, comparedIds, selectedFeature, activeBBox, incidentFeatures, setSelectedId } = props;
  const selectedPoint =
    selectedFeature.geometry.type === "Point"
      ? selectedFeature.geometry.coordinates
      : selectedFeature.geometry.type === "LineString"
        ? selectedFeature.geometry.coordinates[Math.floor(selectedFeature.geometry.coordinates.length / 2)]
        : selectedFeature.geometry.coordinates[0][0];
  const selectedProjection = projectOblique(selectedPoint, activeBBox);
  const referenceMarkers = [
    { x: selectedProjection.x - 24, y: selectedProjection.y + 10, label: "Ingress" },
    { x: selectedProjection.x - 8, y: selectedProjection.y - 11, label: "Stack" },
    { x: selectedProjection.x + 18, y: selectedProjection.y - 8, label: "Perimeter" },
    { x: selectedProjection.x + 24, y: selectedProjection.y + 14, label: "Egress" },
  ];

  return (
    <>
      <div className="absolute inset-0 bg-[#090a08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,24,20,1)_0%,rgba(10,12,10,1)_40%,rgba(5,6,5,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[42%] bg-[linear-gradient(180deg,rgba(17,22,20,0.9),rgba(17,22,20,0.28)_48%,transparent)]" />
      <div className="absolute inset-x-0 top-[34%] h-px bg-[#d6dd7b]/16" />
      <div className="absolute left-[-20%] top-[35%] h-[110%] w-[140%] opacity-[0.15]" style={{ transform: "perspective(1200px) rotateX(72deg)", backgroundImage: "linear-gradient(rgba(214,221,123,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(214,221,123,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute left-[15%] top-[50%] h-[36%] w-[70%] rounded-[50%] border border-[#d6dd7b]/18 opacity-80" style={{ transform: "perspective(1200px) rotateX(72deg)" }} />
      <div className="absolute left-[24%] top-[56%] h-[22%] w-[52%] rounded-[50%] border border-dashed border-[#d6dd7b]/22" style={{ transform: "perspective(1200px) rotateX(72deg)" }} />
      <div 
        className="absolute rounded-full bg-[radial-gradient(circle,rgba(214,221,123,0.12)_0%,transparent_70%)] blur-[40px]" 
        style={{ left: `${selectedProjection.x}%`, top: `${selectedProjection.y}%`, width: "400px", height: "400px", transform: "translate(-50%, -50%)" }} 
      />

      {visibleFeatures
        .filter((feature) => feature.geometry.type === "Polygon")
        .map((feature) => {
          const style = styleForFeature(feature, {
            selected: feature.properties.id === selectedFeature.properties.id,
            compared: comparedIds.includes(feature.properties.id),
            muted: false,
          });
          return (
            <svg key={feature.properties.id} viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path d={toSvgPath(feature, activeBBox, "oblique")} fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} />
            </svg>
          );
        })}

      <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d6dd7b]/60 shadow-[0_0_60px_rgba(214,221,123,0.1)]" style={{ left: `${selectedProjection.x}%`, top: `${selectedProjection.y}%`, width: "160px", height: "160px" }} />
      <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#d6dd7b]/28" style={{ left: `${selectedProjection.x}%`, top: `${selectedProjection.y}%`, width: "240px", height: "240px" }} />

      {referenceMarkers.map((marker) => (
        <div key={marker.label} className="pointer-events-none absolute -translate-x-1/2" style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
          <div className="mx-auto h-7 w-px bg-[#d6dd7b]/45" />
          <div className="mt-1 rounded-sm border border-[#d6dd7b]/18 bg-[#0d0f0b]/78 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[#d6dd7b]/88">
            {marker.label}
          </div>
        </div>
      ))}

      {incidentFeatures.map((feature) => {
        const projected = projectToPercent(feature.geometry.coordinates, activeBBox, "oblique");
        const selected = feature.properties.id === selectedFeature.properties.id;
        return (
          <button
            key={feature.properties.id}
            type="button"
            onClick={() => setSelectedId(feature.properties.id)}
            className="absolute -translate-x-1/2"
            style={{ left: `${projected.x}%`, top: `${projected.y}%` }}
            aria-label={feature.properties.labelPrimary}
          >
            <div className={`h-0 w-0 border-x-[16px] border-b-[30px] border-x-transparent transition-all ${selected ? "border-b-[#f3d87a]" : "border-b-[#d78183]/70"}`} />
            <div className={`mt-1 whitespace-nowrap text-[13px] font-medium transition-all ${selected ? "text-[#f3d87a]" : "text-zinc-100/70"}`}>{feature.properties.labelPrimary}</div>
          </button>
        );
      })}

      <SurfaceCaption eyebrow="Local Surface" title="Oblique Site Inspection" />
      <SurfaceTelemetry
        title="Local Frame"
        className="right-4 top-4 min-w-[180px]"
        values={[
          ["Selected", selectedFeature.properties.id],
          ["Axis", "OBLIQUE / FIXED"],
          ["Depth", "LOCKED / 01"],
        ]}
      />
    </>
  );
}

export function Theater3DView(props: SurfaceViewProps) {
  const { features, selectedFeature, activeBBox, incidentFeatures, ringSizes, setSelectedId } = props;
  const selectedPoint =
    selectedFeature.geometry.type === "Point"
      ? selectedFeature.geometry.coordinates
      : selectedFeature.geometry.type === "LineString"
        ? selectedFeature.geometry.coordinates[Math.floor(selectedFeature.geometry.coordinates.length / 2)]
        : selectedFeature.geometry.coordinates[0][0];
  const selectedProjection = projectOblique(selectedPoint, activeBBox);

  return (
    <>
      <div className="absolute inset-0 bg-[#080908]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,20,25,1)_0%,rgba(8,9,8,1)_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_72%,rgba(250,247,233,0.12),transparent_30%),radial-gradient(circle_at_50%_64%,rgba(255,255,255,0.03),transparent_40%)]" />
      <div className="absolute left-[-10%] top-[40%] h-[96%] w-[134%] rounded-[54px] border border-white/5 opacity-40" style={{ transform: "perspective(1200px) rotateX(71deg)" }} />
      <div className="absolute inset-x-0 top-0 h-[18%] bg-[linear-gradient(180deg,rgba(5,6,5,0.78),transparent)]" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {ringSizes.map((size, index) => (
          <ellipse
            key={size}
            cx={selectedProjection.x}
            cy={selectedProjection.y + 1.5}
            rx={size}
            ry={size * 0.5}
            fill="none"
            stroke={index === ringSizes.length - 1 ? T.verified : "rgba(214,221,123,0.3)"}
            strokeWidth={index === ringSizes.length - 1 ? 0.3 : 0.15}
          />
        ))}
        {[
          [selectedProjection.x, selectedProjection.y + 1.5, 80, 18],
          [selectedProjection.x, selectedProjection.y + 1.5, 61, 78],
          [selectedProjection.x, selectedProjection.y + 1.5, 28, 24],
        ].map(([x1, y1, x2, y2], index) => (
          <g key={index}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.theaterStroke} strokeWidth={0.3} strokeDasharray="2 2" opacity={0.6} />
            <circle cx={x2} cy={y2} r="0.65" fill={T.theaterStroke} opacity="0.75" />
          </g>
        ))}
        <path d={toSvgPath(features[1], activeBBox, "oblique")} fill="none" stroke="#6c84ff" strokeWidth={0.25} opacity={0.8} />
      </svg>

      {[
        [selectedProjection.x - 22, selectedProjection.y - 16, "Bridge Node"],
        [selectedProjection.x - 12, selectedProjection.y - 11, "Vessel Alpha"],
        [selectedProjection.x + 18, selectedProjection.y - 16, "Barrier Primary"],
        [selectedProjection.x + 26, selectedProjection.y + 8, "Patrol Arc 01"],
      ].map(([x, y, label]) => (
        <div key={label} className="absolute text-[12px] font-mono font-medium text-zinc-100/60 uppercase tracking-wider" style={{ left: `${x}%`, top: `${y}%` }}>
          {label}
        </div>
      ))}

      {incidentFeatures.slice(0, 3).map((feature) => {
        const projected = projectToPercent(feature.geometry.coordinates, activeBBox, "oblique");
        return (
          <button
            key={feature.properties.id}
            type="button"
            onClick={() => setSelectedId(feature.properties.id)}
            className="absolute -translate-x-1/2"
            style={{ left: `${projected.x}%`, top: `${projected.y}%` }}
            aria-label={feature.properties.labelPrimary}
          >
            <div className="h-0 w-0 border-x-[12px] border-b-[24px] border-x-transparent border-b-[#d78183]/60" />
          </button>
        );
      })}

      <SurfaceCaption eyebrow="Theater Surface" title="Mission Geometry / Vectors" />
      <SurfaceTelemetry
        title="Theater Grid"
        className="right-4 top-4 min-w-[180px]"
        values={[
          ["Selected", selectedFeature.properties.id],
          ["Rings", `${ringSizes.length} / sync`],
          ["Vectors", "03 / active"],
        ]}
      />
      <div className={`pointer-events-none absolute bottom-4 left-4 ${CLS.surfaceOverlayCard}`}>
        <div className={CLS.surfaceMeta}>Scale Logic</div>
        <div className="mt-2 flex gap-4 text-[11px] font-mono text-zinc-300">
          <span>32km STEP</span>
          <span className="text-[#d6dd7b]">ROUTE LOCK</span>
          <span>MISSION ARC</span>
        </div>
      </div>
    </>
  );
}

export function OpsWallView(props: SurfaceViewProps) {
  const { ringSizes, selectedFeature, visibleFeatures } = props;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),rgba(0,0,0,1)_70%)]" />
      <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <div className="absolute inset-x-[8%] top-[12%] bottom-[10%] border border-zinc-800/80 bg-[rgba(6,8,10,0.85)] shadow-[0_60px_160px_rgba(0,0,0,0.6)]">
        <div className="absolute left-4 top-4 border-l-2 border-t-2 border-zinc-700/50 p-2 text-[10px] uppercase tracking-widest text-zinc-500">
          Wall / Alpha-01
        </div>
        <div className="absolute right-4 top-4 text-right border-r-2 border-t-2 border-zinc-700/50 p-2 text-[10px] uppercase tracking-widest text-zinc-500">
          Ext: {visibleFeatures.length} Active
        </div>
        <div className="absolute inset-x-[12%] top-[14%] flex items-center justify-between border-y border-zinc-800/70 bg-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          {["T-12", "T-08", "T-03", "Live", "T+02"].map((tick) => (
            <div key={tick} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ef8f45]/60" />
              {tick}
            </div>
          ))}
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-60">
          {ringSizes.map((size) => (
            <ellipse key={size} cx="52" cy="48" rx={size + 6} ry={(size + 6) * 0.58} fill="none" stroke="rgba(214,221,123,0.22)" strokeWidth="0.25" />
          ))}
          <line x1="52" y1="48" x2="85" y2="25" stroke={T.theaterStroke} strokeWidth="0.35" strokeDasharray="1 1" />
          <line x1="52" y1="48" x2="25" y2="35" stroke={T.theaterStroke} strokeWidth="0.35" strokeDasharray="1 1" />
          <line x1="52" y1="48" x2="58" y2="80" stroke={T.theaterStroke} strokeWidth="0.35" strokeDasharray="1 1" />
        </svg>

        {/* Status Indicators */}
        <div className="absolute left-[8%] top-[25%] space-y-4">
          {[
            { label: "Link Sync", value: "Locked", color: "text-[#b7ca52]" },
            { label: "Telemetry", value: "Nominal", color: "text-[#b7ca52]" },
            { label: "Queue", value: "Active", color: "text-[#ef8f45]" },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-zinc-700 pl-3">
              <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">{stat.label}</div>
              <div className={`mt-0.5 text-xs font-medium uppercase tracking-wider ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="absolute right-[8%] top-[25%] space-y-4">
          {[
            { label: "Zone", value: selectedFeature.properties.regionCode, color: "text-zinc-100" },
            { label: "Priority", value: selectedFeature.properties.priority.toUpperCase(), color: "text-[#ef8f45]" },
            { label: "Confidence", value: selectedFeature.properties.confidence.toUpperCase(), color: "text-[#5fc8d8]" },
          ].map((stat) => (
            <div key={stat.label} className="border-r border-zinc-700 pr-3 text-right">
              <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">{stat.label}</div>
              <div className={`mt-0.5 text-xs font-medium uppercase tracking-wider ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_42%_32%,rgba(255,255,255,0.14),rgba(32,48,80,0.2),rgba(0,0,0,0.8))] shadow-[0_0_100px_rgba(32,48,80,0.3)]" />
        <div className="absolute left-1/2 top-1/2 h-[1px] w-[48%] -translate-x-1/2 -translate-y-1/2 bg-white/10" />
        <div className="absolute left-1/2 top-1/2 h-[38%] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-white/10" />
        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          Active Object // {selectedFeature.properties.id}
        </div>
        <div className="absolute bottom-[22%] left-[12%] right-[12%] grid grid-cols-3 gap-3">
          {[
            ["Route Sync", "03 vectors"],
            ["Wall State", "Aggregation"],
            ["Sector", selectedFeature.properties.regionCode],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-zinc-800/80 bg-black/20 px-3 py-2">
              <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-zinc-100">{value}</div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-[8%] left-[12%] right-[12%] flex items-center justify-between">
          {["Ingress", "Observe", "Track", "Escalate", "Resolve"].map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
              <span className={`h-2 w-2 rounded-full ${index === 2 ? "bg-[#ef8f45]" : "bg-zinc-700"}`} />
              {label}
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 flex gap-12">
           <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Mission Object</div>
              <div className="mt-1 text-base font-semibold text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
           </div>
           <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Global Monitoring</div>
              <div className="mt-1 text-base font-semibold text-[#ef8f45]">Sector Alert</div>
           </div>
        </div>
      </div>
    </div>
  );
}
