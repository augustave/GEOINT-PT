import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { T } from "./config";
import { styleForFeature, toSvgPath } from "./geo";
import type { PointFeature, SurfaceViewProps } from "./types";

export function FlatMapView(props: SurfaceViewProps) {
  const { visibleFeatures, comparedIds, selectedFeature, activeBBox, selectionProjection, setSelectedId } = props;

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,120,90,0.10),rgba(10,10,10,0.42)_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

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
                {selected && <path d={toSvgPath(feature, activeBBox)} fill="none" stroke={style.halo} strokeWidth={1.35} />}
                <path d={toSvgPath(feature, activeBBox)} fill="none" stroke={style.stroke} strokeWidth={style.strokeWidth} strokeDasharray={style.dashArray} />
              </g>
            );
          })}
      </svg>

      {visibleFeatures
        .filter((feature): feature is PointFeature => feature.geometry.type === "Point")
        .map((feature) => {
          const point = feature.geometry.coordinates;
          const style = styleForFeature(feature, {
            selected: feature.properties.id === selectedFeature.properties.id,
            compared: comparedIds.includes(feature.properties.id),
            muted: false,
          });
          const projectedX = ((point[0] - activeBBox[0]) / ((activeBBox[2] - activeBBox[0]) || 1)) * 100;
          const projectedY = 100 - ((point[1] - activeBBox[1]) / ((activeBBox[3] - activeBBox[1]) || 1)) * 100;

          return (
            <button
              key={feature.properties.id}
              type="button"
              onClick={() => setSelectedId(feature.properties.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
              style={{
                left: `${projectedX}%`,
                top: `${projectedY}%`,
                width: `${style.radius! * 10}px`,
                height: `${style.radius! * 10}px`,
                background: style.fill,
                border: `${style.strokeWidth}px solid ${style.stroke}`,
                boxShadow: `0 0 0 9px ${style.halo}`,
              }}
              aria-label={feature.properties.labelPrimary}
            />
          );
        })}

      <motion.div layout className="absolute left-4 top-4 max-w-xs rounded-xl border border-zinc-700/80 bg-[#171812]/95 p-3 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-meta-xs uppercase tracking-[0.18em] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-[#d1b16d]" /> Interaction Spine
        </div>
        <div className="mt-1.5 text-base font-medium text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
        <div className="mt-0.5 text-label text-zinc-400">{selectedFeature.properties.labelSecondary}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[selectedFeature.properties.id, selectedFeature.geometry.type, `${selectedFeature.properties.confidence} confidence`, selectedFeature.properties.regionCode].map((tag) => (
            <span key={tag} className="rounded-full border border-zinc-700 bg-[#1f2019] px-2 py-0.5 text-meta-xs uppercase text-zinc-300">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute rounded-full border border-dashed border-[#d1b16d]/55"
        style={{ left: `${selectionProjection.x}%`, top: `${selectionProjection.y}%`, width: "90px", height: "90px", transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}

export function EOOverlayView(props: SurfaceViewProps) {
  const { incidentFeatures, selectionAnchor, activeBBox, setSelectedId } = props;

  return (
    <>
      <div className="absolute inset-0 bg-[#5d5a55]" />
      <div className="absolute inset-0 opacity-80" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.12), rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.18))" }} />
      <div className="absolute inset-y-0 right-[12%] w-[18%] bg-[rgba(40,40,40,0.12)] blur-[2px]" />
      <div className="absolute left-[10%] top-[18%] h-[60%] w-[18%] rounded-[120px] bg-[rgba(20,30,20,0.28)] blur-[18px]" />

      <div className="absolute left-[55%] top-[24%] h-[17%] w-[14%] border-[3px] border-red-500/90" />
      {[
        [50, 16, 11, 6], [50, 25, 11, 6], [49, 34, 11, 6], [48, 43, 10, 6],
        [43, 57, 15, 7], [42, 65, 14, 7], [41, 73, 15, 7],
      ].map(([x, y, w, h], i) => (
        <div key={`amber-${i}`} className="absolute border-[3px] border-amber-400/95" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
      ))}
      {[
        [40, 48, 12, 13], [44, 33, 12, 14], [48, 56, 14, 16], [66, 13, 11, 4],
      ].map(([x, y, w, h], i) => (
        <div key={`blue-${i}`} className="absolute border-[3px] border-blue-500/90" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
      ))}

      <div className="absolute left-[52%] top-[41%] h-[34%] w-[34%] rounded-full border border-cyan-300/55" />
      <div className="absolute left-[62%] top-[53%] h-[10px] w-[18%] origin-left rotate-[-20deg] bg-cyan-300/70" />
      <div className="absolute left-[74%] top-[48%] text-label text-zinc-100">20m</div>
      {([[64, 36, "N"], [56, 57, "S"], [48, 43, "W"], [80, 63, "E"]] as const).map(([x, y, label]) => (
        <div key={label} className="absolute text-label font-medium text-zinc-100/80" style={{ left: `${x}%`, top: `${y}%` }}>{label}</div>
      ))}

      {incidentFeatures.map((feature) => {
        const point = feature.geometry.type === "Point" ? feature.geometry.coordinates : selectionAnchor;
        const projectedX = ((point[0] - activeBBox[0]) / ((activeBBox[2] - activeBBox[0]) || 1)) * 100;
        const projectedY = 100 - ((point[1] - activeBBox[1]) / ((activeBBox[3] - activeBBox[1]) || 1)) * 100;

        return (
          <button
            key={feature.properties.id}
            type="button"
            onClick={() => setSelectedId(feature.properties.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-800 bg-zinc-100 shadow-[0_0_0_4px_rgba(20,20,20,0.16)]"
            style={{ left: `${projectedX}%`, top: `${projectedY}%`, width: "14px", height: "14px" }}
          />
        );
      })}

      <div className="absolute inset-x-0 top-0 h-14 bg-black/40" />
      <div className="absolute left-0 top-0 flex h-14 items-center gap-3 px-4">
        <div className="rounded-md bg-blue-600 px-2.5 py-1.5 text-label font-medium text-white">Tag</div>
        <div className="text-label text-zinc-400">03MAY2024 22:37:02Z</div>
      </div>
      <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-lg border border-zinc-300/20 bg-black/55 px-6 py-2.5 text-xl font-medium text-zinc-100">
        Overhead Interrogation
      </div>
    </>
  );
}

export function Site3DView(props: SurfaceViewProps) {
  const { visibleFeatures, comparedIds, selectedFeature, activeBBox, selectionOblique } = props;

  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b7c8d6_0%,#9aa2a8_18%,#0f1110_19%,#10100f_100%)]" />
      <div className="absolute left-[-10%] top-[40%] h-[90%] w-[130%] rounded-[40px] border border-white/5 opacity-60" style={{ transform: "perspective(1000px) rotateX(72deg)" }} />
      <div
        className="absolute left-[-10%] top-[42%] h-[90%] w-[130%] opacity-20"
        style={{
          transform: "perspective(1000px) rotateX(72deg)",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="absolute bottom-0 left-0 h-[28%] w-[28%] bg-[linear-gradient(180deg,rgba(40,115,120,0.0),rgba(36,138,129,0.75))] blur-[2px]" />
      <div className="absolute bottom-[18%] left-[0%] h-[10%] w-[60%] bg-[#d8d3c7]/85 [clip-path:polygon(0_25%,100%_0,100%_100%,0_100%)] opacity-80" />

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

      {[
        { x: selectionOblique.x, y: selectionOblique.y - 1, label: selectedFeature.properties.labelPrimary },
        { x: selectionOblique.x - 16, y: selectionOblique.y - 9, label: "Containers" },
        { x: selectionOblique.x + 12, y: selectionOblique.y - 18, label: "Bridge" },
        { x: selectionOblique.x + 18, y: selectionOblique.y - 11, label: "Vessel" },
      ].map((marker, i) => (
        <div key={`marker-${i}`} className="absolute" style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
          <div className="h-0 w-0 -translate-x-1/2 border-x-[18px] border-b-[34px] border-x-transparent border-b-[#d78183]/78" />
          <div className="mt-1 -translate-x-1/2 whitespace-nowrap text-body font-medium text-zinc-100/85">{marker.label}</div>
        </div>
      ))}

      <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d6dd7b]/90" style={{ left: `${selectionOblique.x}%`, top: `${selectionOblique.y}%`, width: "128px", height: "128px" }} />

      <div className="absolute left-4 top-3 rounded-lg border border-[#b0bf63]/25 bg-black/55 px-3 py-2.5 text-body text-zinc-100">
        <span className="mr-2 text-zinc-400">SELECTED:</span>
        <span className="font-medium">{selectedFeature.properties.labelPrimary}</span>
        <span className="mx-3 text-zinc-500">Building</span>
        <span className="text-zinc-300">Aimpoints (3x)</span>
        <button type="button" className="ml-3 rounded-md border border-[#b0bf63]/40 px-2.5 py-1 text-[#d6dd7b]">
          Task Asset
        </button>
      </div>
    </>
  );
}

export function Theater3DView(props: SurfaceViewProps) {
  const { features, selectedFeature, activeBBox, selectionOblique, ringSizes } = props;

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(110,110,110,0.18),rgba(0,0,0,0.88)_50%)]" />
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="absolute left-[4%] top-[18%] h-[52%] w-[44%] rounded-r-[240px] bg-white/12 blur-[2px]" />

      <div className="absolute left-4 top-3 rounded-lg border border-[#b0bf63]/25 bg-black/65 px-3 py-2.5 text-body text-zinc-100">
        <span className="mr-2 text-zinc-400">ASSIGN ASSET:</span>
        <span className="font-medium">{selectedFeature.properties.labelPrimary}</span>
        <span className="mx-2 text-zinc-500">›</span>
        <span className="text-zinc-300">Dragnet71-11-2</span>
        <span className="ml-2 text-zinc-500">Flight</span>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {ringSizes.map((size, i) => (
          <ellipse
            key={size}
            cx={selectionOblique.x}
            cy={selectionOblique.y + 2}
            rx={size}
            ry={size * 0.52}
            fill="none"
            stroke={i === ringSizes.length - 1 ? T.verified : "rgba(214,221,123,0.65)"}
            strokeWidth={i === ringSizes.length - 1 ? 0.35 : 0.2}
          />
        ))}
        {[
          [selectionOblique.x, selectionOblique.y + 2, 11, 13],
          [selectionOblique.x, selectionOblique.y + 2, 76, 18],
          [selectionOblique.x, selectionOblique.y + 2, 54, 70],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={T.theaterStroke} strokeWidth={0.4} />
        ))}
        <path d={toSvgPath(features[1], activeBBox, "oblique")} fill="none" stroke="#6582ff" strokeWidth={0.3} />
      </svg>

      {[
        [selectionOblique.x - 18, selectionOblique.y - 14, "F-16CM-52"],
        [selectionOblique.x - 10, selectionOblique.y - 8, "Tornado.GR.4"],
        [selectionOblique.x + 4, selectionOblique.y - 2, "Dragnet71"],
        [selectionOblique.x + 16, selectionOblique.y - 13, "CH-47"],
        [selectionOblique.x - 6, selectionOblique.y - 20, "Cargo Ship Han"],
        [selectionOblique.x - 28, selectionOblique.y + 4, "F-15D"],
        [selectionOblique.x + 22, selectionOblique.y + 12, "Sentry41"],
      ].map(([x, y, label], i) => (
        <div key={`asset-${i}`} className="absolute text-body font-medium text-zinc-100/78" style={{ left: `${x}%`, top: `${y}%` }}>
          {label}
        </div>
      ))}
    </>
  );
}

export function OpsWallView(props: SurfaceViewProps) {
  const { visibleFeatures, comparedIds, extentMode, ringSizes } = props;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#090909] p-3">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {["MEXICO", "NEPAL", "ALGIERS", "ARCTIC", "MADRID", "DUBAI", "CAIRO", "SEOUL"].map((city, i) => (
          <div key={city} className="min-w-[68px] flex-1 rounded-md border border-zinc-800 bg-black px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-[0.16em] text-zinc-500">{city}</div>
            <div className="mt-0.5 text-lg font-semibold tracking-tight text-red-500">{String((19 + i) % 24).padStart(2, "0")}:30</div>
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 gap-2">
        <div className="flex w-[180px] shrink-0 flex-col gap-2">
          {["Mission Queue", "Asset Status", "Alerts"].map((panel) => (
            <div key={panel} className="rounded-lg border border-zinc-800 bg-[#101113] p-2.5">
              <div className="text-meta-xs uppercase tracking-[0.18em] text-zinc-500">{panel}</div>
              <div className="mt-1.5 space-y-1 text-label text-zinc-300">
                <div className="rounded-md border border-zinc-800 bg-black/40 p-1.5">Transloading Facility · active tasking</div>
                <div className="rounded-md border border-zinc-800 bg-black/40 p-1.5">Dragnet71-11-2 · in range envelope</div>
                <div className="rounded-md border border-zinc-800 bg-black/40 p-1.5">Checkpoint Delta Event · medium confidence</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-[#0e1012]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,240,240,0.08),rgba(0,0,0,0.72)_55%)]" />
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {ringSizes.map((size) => (
              <ellipse key={size} cx="52" cy="48" rx={size + 4} ry={(size + 4) * 0.62} fill="none" stroke="rgba(214,221,123,0.35)" strokeWidth="0.3" />
            ))}
            <line x1="52" y1="48" x2="87" y2="22" stroke={T.theaterStroke} strokeWidth="0.4" />
            <line x1="52" y1="48" x2="36" y2="18" stroke={T.theaterStroke} strokeWidth="0.4" />
            <line x1="52" y1="48" x2="60" y2="78" stroke={T.theaterStroke} strokeWidth="0.4" />
          </svg>
          <div className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.18),rgba(45,60,110,0.25),rgba(0,0,0,0.55))]" />
          <div className="absolute bottom-3 left-1/2 w-[240px] -translate-x-1/2 rounded-lg border border-zinc-700 bg-black/65 p-2">
            <div className="text-meta-xs uppercase tracking-[0.18em] text-zinc-500">Central mission surface</div>
            <div className="mt-0.5 text-label text-zinc-200">Global monitoring, range geometry, cross-domain asset assignment</div>
          </div>
        </div>

        <div className="flex w-[180px] shrink-0 flex-col gap-2">
          {["Map Analytics", "Freshness Summary", "Confidence Split"].map((panel) => (
            <div key={panel} className="rounded-lg border border-zinc-800 bg-[#101113] p-2.5">
              <div className="text-meta-xs uppercase tracking-[0.18em] text-zinc-500">{panel}</div>
              <div className="mt-2 flex items-center gap-2.5">
                <div className="h-12 w-12 shrink-0 rounded-full border-[5px] border-zinc-700 border-t-[#b7ca52] border-r-[#ef8f45]" />
                <div className="text-label text-zinc-300">
                  <div>Operational: {visibleFeatures.length}</div>
                  <div>Compared: {comparedIds.length}</div>
                  <div>Extent: {extentMode}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
