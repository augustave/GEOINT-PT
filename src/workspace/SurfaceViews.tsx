import { motion } from "framer-motion";
import { styleForFeature, toSvgPath, projectOblique, projectPoint } from "./geo";
import { T } from "./config";
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

      <div className="pointer-events-none absolute left-4 top-4 rounded-[12px] border border-zinc-700/70 bg-[#12130f]/90 px-3 py-2 backdrop-blur-sm">
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

  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1f2a_0%,#1b4e5d_22%,#6aa6a8_54%,#9e8f48_85%,#4c6a53_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(95,200,216,0.26),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(239,191,95,0.16),transparent_45%)] mix-blend-screen opacity-70" />
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />

      <div className="absolute left-[34%] top-[14%] h-[28%] w-[22%] rounded-[4px] border-[3px] border-cyan-300/85" />
      <div className="absolute left-[58%] top-[18%] h-[26%] w-[16%] rounded-[4px] border-[3px] border-cyan-300/85" />

      {[
        [44, 46, 13, 7],
        [45, 56, 13, 7],
        [45, 66, 12, 7],
        [38, 81, 18, 8],
      ].map(([x, y, w, h], index) => (
        <div key={`amber-${index}`} className="absolute border-[3px] border-[#f1c15f]/95" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
      ))}

      {[
        [39, 63, 15, 12],
        [52, 60, 17, 14],
        [68, 20, 11, 5],
      ].map(([x, y, w, h], index) => (
        <div key={`blue-${index}`} className="absolute border-[3px] border-[#55b8df]/90" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
      ))}

      <div className="absolute rounded-full border border-cyan-300/55" style={{ left: `calc(${selectedProjection.x}% - 90px)`, top: `calc(${selectedProjection.y}% - 90px)`, width: "180px", height: "180px" }} />
      <div className="absolute h-[2px] origin-left bg-cyan-300/70" style={{ left: `${selectedProjection.x}%`, top: `${selectedProjection.y}%`, width: "18%", transform: "rotate(-18deg)" }} />
      <div className="absolute text-[12px] text-zinc-100/85" style={{ left: `calc(${selectedProjection.x}% + 14%)`, top: `calc(${selectedProjection.y}% - 4%)` }}>20m</div>

      {([
        [selectedProjection.x + 8, selectedProjection.y - 14, "N"],
        [selectedProjection.x - 8, selectedProjection.y + 11, "S"],
        [selectedProjection.x - 16, selectedProjection.y - 1, "W"],
        [selectedProjection.x + 17, selectedProjection.y + 13, "E"],
      ] as const).map(([x, y, label]) => (
        <div key={label} className="absolute text-[12px] font-medium text-zinc-100/75" style={{ left: `${x}%`, top: `${y}%` }}>
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
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${pointMarkerClass(selected, feature.properties.operationalState === "alert")}`}
            style={{ left: `${projected.x}%`, top: `${projected.y}%`, width: selected ? "18px" : "12px", height: selected ? "18px" : "12px" }}
            aria-label={feature.properties.labelPrimary}
          />
        );
      })}

      <motion.div
        layout
        className="pointer-events-none absolute bottom-5 right-5 w-[240px] rounded-[14px] border border-zinc-200/15 bg-[rgba(98,118,102,0.56)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-md"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-[15px] font-medium text-zinc-50">{selectedFeature.properties.labelPrimary}</div>
          <div className="h-3 w-7 rounded-sm bg-[#35d7e6]" />
        </div>
        <div className="mt-4 space-y-2 text-sm text-zinc-200/85">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span>Heading</span>
            <span>28.1°</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span>Altitude</span>
            <span>108 ft</span>
          </div>
        </div>
        <div className="mt-4 h-28 rounded-[10px] border border-black/20 bg-[linear-gradient(180deg,rgba(215,215,215,0.88),rgba(55,55,55,0.94))]" />
      </motion.div>
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

  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#c8d7e1_0%,#d9ddd5_17%,#10120f_18%,#090908_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_68%,rgba(247,244,225,0.78),transparent_20%),radial-gradient(circle_at_12%_92%,rgba(52,126,120,0.92),transparent_14%)]" />
      <div className="absolute left-[-12%] top-[40%] h-[96%] w-[136%] rounded-[54px] border border-white/5 opacity-70" style={{ transform: "perspective(1200px) rotateX(71deg)" }} />
      <div className="absolute left-[-12%] top-[42%] h-[96%] w-[136%] opacity-20" style={{ transform: "perspective(1200px) rotateX(71deg)", backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "78px 78px" }} />

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

      <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d6dd7b]/90" style={{ left: `${selectedProjection.x}%`, top: `${selectedProjection.y}%`, width: "132px", height: "132px" }} />

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
            <div className="h-0 w-0 border-x-[18px] border-b-[34px] border-x-transparent border-b-[#d78183]/80" />
            <div className="mt-1 whitespace-nowrap text-[14px] font-medium text-zinc-100/86">{feature.properties.labelPrimary}</div>
            {selected ? <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-[#f3d87a]" /> : null}
          </button>
        );
      })}
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b9c7d4_0%,#a8acaa_15%,#090909_17%,#080808_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_72%,rgba(250,247,233,0.72),transparent_18%),radial-gradient(circle_at_50%_64%,rgba(255,255,255,0.06),transparent_34%)]" />
      <div className="absolute left-[-10%] top-[40%] h-[96%] w-[134%] rounded-[54px] border border-white/5 opacity-65" style={{ transform: "perspective(1200px) rotateX(71deg)" }} />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {ringSizes.map((size, index) => (
          <ellipse
            key={size}
            cx={selectedProjection.x}
            cy={selectedProjection.y + 1.5}
            rx={size}
            ry={size * 0.5}
            fill="none"
            stroke={index === ringSizes.length - 1 ? T.verified : "rgba(214,221,123,0.52)"}
            strokeWidth={index === ringSizes.length - 1 ? 0.4 : 0.22}
          />
        ))}
        {[
          [selectedProjection.x, selectedProjection.y + 1.5, 80, 18],
          [selectedProjection.x, selectedProjection.y + 1.5, 61, 78],
          [selectedProjection.x, selectedProjection.y + 1.5, 28, 24],
        ].map(([x1, y1, x2, y2], index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.theaterStroke} strokeWidth={0.4} />
        ))}
        <path d={toSvgPath(features[1], activeBBox, "oblique")} fill="none" stroke="#6c84ff" strokeWidth={0.34} />
      </svg>

      {[
        [selectedProjection.x - 20, selectedProjection.y - 14, "Bridge"],
        [selectedProjection.x - 10, selectedProjection.y - 9, "Vessel"],
        [selectedProjection.x + 16, selectedProjection.y - 14, "Canal Barrier"],
        [selectedProjection.x + 24, selectedProjection.y + 6, "Patrol Arc"],
      ].map(([x, y, label]) => (
        <div key={label} className="absolute text-[14px] font-medium text-zinc-100/82" style={{ left: `${x}%`, top: `${y}%` }}>
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
            <div className="h-0 w-0 border-x-[15px] border-b-[28px] border-x-transparent border-b-[#d78183]/78" />
          </button>
        );
      })}
    </>
  );
}

export function OpsWallView(props: SurfaceViewProps) {
  const { ringSizes, selectedFeature } = props;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#090909]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.08),rgba(0,0,0,0.82)_60%)]" />
      <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "62px 62px" }} />

      <div className="absolute inset-x-[12%] top-[18%] bottom-[12%] border border-zinc-700/60 bg-[rgba(8,10,12,0.78)] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {ringSizes.map((size) => (
            <ellipse key={size} cx="52" cy="46" rx={size + 5} ry={(size + 5) * 0.6} fill="none" stroke="rgba(214,221,123,0.28)" strokeWidth="0.3" />
          ))}
          <line x1="52" y1="46" x2="82" y2="20" stroke={T.theaterStroke} strokeWidth="0.42" />
          <line x1="52" y1="46" x2="32" y2="22" stroke={T.theaterStroke} strokeWidth="0.42" />
          <line x1="52" y1="46" x2="60" y2="75" stroke={T.theaterStroke} strokeWidth="0.42" />
        </svg>
        <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[radial-gradient(circle_at_42%_32%,rgba(255,255,255,0.18),rgba(36,52,90,0.22),rgba(0,0,0,0.65))]" />
        <div className="absolute left-[10%] top-[18%] text-[12px] uppercase tracking-[0.2em] text-zinc-500">Central Mission Surface</div>
        <div className="absolute bottom-[12%] left-1/2 w-[280px] -translate-x-1/2 text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Selected Mission Object</div>
          <div className="mt-2 text-sm font-medium text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
        </div>
      </div>
    </div>
  );
}
