import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Crosshair,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Globe2,
  Layers3,
  LocateFixed,
  MapPinned,
  Monitor,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Target,
  TimerReset,
} from "lucide-react";

type Position = [number, number];
type BBox = [number, number, number, number];
type EntityType = "incident" | "route" | "zone" | "site";
type Priority = "low" | "medium" | "high" | "critical";
type Confidence = "low" | "medium" | "high" | "confirmed";
type Freshness = "recent" | "aging" | "stale";
type OperationalState = "default" | "active" | "selected" | "alert" | "stale";
type WorkspaceMode = "flat-map" | "eo-overlay" | "site-3d" | "theater-3d" | "ops-wall";
type ExtentMode = "operational" | "selection" | "compare";

type Geometry =
  | { type: "Point"; coordinates: Position }
  | { type: "LineString"; coordinates: Position[] }
  | { type: "Polygon"; coordinates: Position[][] };

interface FeatureProperties {
  id: string;
  entityType: EntityType;
  labelPrimary: string;
  labelSecondary: string;
  operationalState: OperationalState;
  priority: Priority;
  confidence: Confidence;
  freshness: Freshness;
  sourceClass: string;
  regionCode: string;
  evidenceRefs: string[];
  summary: string;
  timeLabel: string;
}

interface Feature {
  type: "Feature";
  geometry: Geometry;
  properties: FeatureProperties;
}

type PointFeature = Feature & { geometry: { type: "Point"; coordinates: Position } };

const MAP_PADDING = 0.08;

const PRIORITY_RANK: Record<Priority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const MODES: Array<{
  id: WorkspaceMode;
  label: string;
  description: string;
  Icon: typeof MapPinned;
}> = [
  {
    id: "flat-map",
    label: "Map Core",
    description: "2D feature truth, bbox fit, dossier sync",
    Icon: MapPinned,
  },
  {
    id: "eo-overlay",
    label: "EO Overlay",
    description: "Overhead exploitation, aimpoints, mensuration",
    Icon: Target,
  },
  {
    id: "site-3d",
    label: "Site 3D",
    description: "Oblique local context, task-asset view",
    Icon: Globe2,
  },
  {
    id: "theater-3d",
    label: "Theater 3D",
    description: "Range rings, flight tasking, deconfliction",
    Icon: Route,
  },
  {
    id: "ops-wall",
    label: "Ops Wall",
    description: "Mission wall, clocks, analytics, command surface",
    Icon: Monitor,
  },
];

const LAYERS = [
  { id: "zones", label: "Zones" },
  { id: "routes", label: "Routes" },
  { id: "incidents", label: "Incidents" },
  { id: "sites", label: "Sites" },
] as const;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function normalizeLongitude(lng: number) {
  let normalized = ((lng + 180) % 360 + 360) % 360 - 180;
  if (normalized === -180) normalized = 180;
  return normalized;
}

function clampLatitude(lat: number) {
  return Math.max(-85.05112878, Math.min(85.05112878, lat));
}

function destinationPoint(origin: Position, bearingDegrees: number, distanceMeters: number): Position {
  const earthRadiusMeters = 6371008.8;
  const [lng, lat] = origin;
  const theta = toRadians(bearingDegrees);
  const delta = distanceMeters / earthRadiusMeters;
  const phi1 = toRadians(lat);
  const lambda1 = toRadians(lng);

  const sinPhi2 = Math.sin(phi1) * Math.cos(delta) + Math.cos(phi1) * Math.sin(delta) * Math.cos(theta);
  const phi2 = Math.asin(sinPhi2);

  const y = Math.sin(theta) * Math.sin(delta) * Math.cos(phi1);
  const x = Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2);
  const lambda2 = lambda1 + Math.atan2(y, x);

  return [normalizeLongitude(toDegrees(lambda2)), clampLatitude(toDegrees(phi2))];
}

function approximateCircle(center: Position, radiusMeters: number, steps = 72): Position[] {
  const ring: Position[] = [];
  for (let i = 0; i < steps; i += 1) {
    ring.push(destinationPoint(center, (i / steps) * 360, radiusMeters));
  }
  ring.push(ring[0]);
  return ring;
}

function createExampleCollection(): Feature[] {
  return [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [approximateCircle([12.49, 41.89], 3200)],
      },
      properties: {
        id: "ZON-021",
        entityType: "zone",
        labelPrimary: "Search Radius Alpha",
        labelSecondary: "Derived analysis · Sector 07",
        operationalState: "selected",
        priority: "medium",
        confidence: "high",
        freshness: "recent",
        sourceClass: "derived_analysis",
        regionCode: "SECTOR-07",
        evidenceRefs: ["DOC-014 Analyst note", "IMG-019 Aerial crop"],
        summary:
          "Computed search-radius overlay approximated from sampled geodesic points. Used to frame the active review envelope.",
        timeLabel: "Window: 12:00–18:00 UTC",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [12.44, 41.84],
          [12.47, 41.86],
          [12.5, 41.89],
          [12.54, 41.915],
        ],
      },
      properties: {
        id: "RTE-088",
        entityType: "route",
        labelPrimary: "Corridor Ember 3",
        labelSecondary: "Derived analysis · East link",
        operationalState: "active",
        priority: "medium",
        confidence: "high",
        freshness: "recent",
        sourceClass: "derived_analysis",
        regionCode: "CORRIDOR-E3",
        evidenceRefs: ["RPT-087 Route reconstruction"],
        summary:
          "High-confidence corridor linking southern staging area to sector transition point. Rendered as GeoJSON line geometry.",
        timeLabel: "Updated 20m ago",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.52, 41.91],
      },
      properties: {
        id: "INC-0142",
        entityType: "incident",
        labelPrimary: "Checkpoint Delta Event",
        labelSecondary: "Sensor ingest · Sector 07",
        operationalState: "alert",
        priority: "high",
        confidence: "medium",
        freshness: "recent",
        sourceClass: "sensor_ingest",
        regionCode: "SECTOR-07",
        evidenceRefs: ["IMG-044 Thermal frame", "SRC-201 Sensor burst"],
        summary:
          "Unusual activity clustered near the eastern boundary. Incident point links back into the active range overlay and route corridor.",
        timeLabel: "14:32 UTC",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [12.455, 41.83],
      },
      properties: {
        id: "STE-203",
        entityType: "site",
        labelPrimary: "Depot North Marker",
        labelSecondary: "Historical archive · Site",
        operationalState: "stale",
        priority: "low",
        confidence: "confirmed",
        freshness: "stale",
        sourceClass: "historical_archive",
        regionCode: "SITE-N2",
        evidenceRefs: ["SRC-044 Registry extract"],
        summary:
          "Persistent site anchor used for compare logic and route context. Deliberately shown as stale to demonstrate freshness semantics.",
        timeLabel: "Last verified 3d ago",
      },
    },
  ];
}

function computeGeometryBBox(geometry: Geometry): BBox {
  const bbox: BBox = [Infinity, Infinity, -Infinity, -Infinity];

  const walk = (value: unknown) => {
    if (!Array.isArray(value)) return;
    if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
      const lng = value[0] as number;
      const lat = value[1] as number;
      bbox[0] = Math.min(bbox[0], lng);
      bbox[1] = Math.min(bbox[1], lat);
      bbox[2] = Math.max(bbox[2], lng);
      bbox[3] = Math.max(bbox[3], lat);
      return;
    }
    value.forEach(walk);
  };

  walk((geometry as { coordinates: unknown }).coordinates);
  return bbox;
}

function computeFeatureBBox(feature: Feature): BBox {
  return computeGeometryBBox(feature.geometry);
}

function mergeBBoxes(a?: BBox, b?: BBox): BBox | undefined {
  if (!a) return b ? ([...b] as BBox) : undefined;
  if (!b) return [...a] as BBox;
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
}

function computeCollectionBBox(features: Feature[]): BBox | undefined {
  return features.reduce<BBox | undefined>((acc, feature) => mergeBBoxes(acc, computeFeatureBBox(feature)), undefined);
}

function expandBBox(bbox: BBox, ratio = MAP_PADDING): BBox {
  const width = bbox[2] - bbox[0] || 0.01;
  const height = bbox[3] - bbox[1] || 0.01;
  return [bbox[0] - width * ratio, bbox[1] - height * ratio, bbox[2] + width * ratio, bbox[3] + height * ratio];
}

function projectPoint(position: Position, bbox: BBox) {
  const width = bbox[2] - bbox[0] || 1;
  const height = bbox[3] - bbox[1] || 1;
  const x = ((position[0] - bbox[0]) / width) * 100;
  const y = 100 - ((position[1] - bbox[1]) / height) * 100;
  return { x, y };
}

function projectOblique(position: Position, bbox: BBox) {
  const flat = projectPoint(position, bbox);
  const y = 22 + flat.y * 0.56;
  const x = 8 + flat.x * 0.86 + (50 - flat.y) * 0.14;
  return { x, y };
}

function toSvgPath(feature: Feature, bbox: BBox, projection: "flat" | "oblique" = "flat") {
  const projector = projection === "flat" ? projectPoint : projectOblique;

  if (feature.geometry.type === "LineString") {
    return feature.geometry.coordinates
      .map((point, index) => {
        const p = projector(point, bbox);
        return `${index === 0 ? "M" : "L"}${p.x},${p.y}`;
      })
      .join(" ");
  }

  if (feature.geometry.type === "Polygon") {
    return (
      feature.geometry.coordinates[0]
        .map((point, index) => {
          const p = projector(point, bbox);
          return `${index === 0 ? "M" : "L"}${p.x},${p.y}`;
        })
        .join(" ") + " Z"
    );
  }

  return "";
}

function entityLayer(entityType: EntityType) {
  if (entityType === "incident") return "incidents";
  if (entityType === "route") return "routes";
  if (entityType === "zone") return "zones";
  return "sites";
}

function featureMatchesQuery(feature: Feature, query: string) {
  if (!query.trim()) return true;
  const haystack = `${feature.properties.id} ${feature.properties.labelPrimary} ${feature.properties.labelSecondary} ${feature.properties.regionCode}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function topBarTitle(mode: WorkspaceMode) {
  switch (mode) {
    case "eo-overlay":
      return "Aimpoint selection, mensuration, object markup";
    case "site-3d":
      return "Selected site, task asset, local 3D operating picture";
    case "theater-3d":
      return "Flight tasking, range rings, theater deconfliction";
    case "ops-wall":
      return "Operations wall, mission clocks, global monitoring";
    default:
      return "Extent driven by visible collection, selection, or compare scope";
  }
}

function statusClasses(state: OperationalState) {
  switch (state) {
    case "alert":
      return "border-orange-400/70 bg-orange-200/70 text-zinc-900";
    case "selected":
      return "border-yellow-500/70 bg-yellow-200/70 text-zinc-900";
    case "active":
      return "border-lime-500/70 bg-lime-200/70 text-zinc-900";
    case "stale":
      return "border-cyan-400/70 bg-cyan-200/70 text-zinc-900";
    default:
      return "border-zinc-700 bg-zinc-200/70 text-zinc-900";
  }
}

function styleForFeature(feature: Feature, options: { selected: boolean; compared: boolean; muted: boolean }) {
  const { selected, compared, muted } = options;

  if (feature.geometry.type === "Point") {
    const baseFill =
      feature.properties.operationalState === "alert"
        ? "#ef8f45"
        : feature.properties.entityType === "site"
          ? "#5fc8d8"
          : "#e4dccf";

    return {
      fill: muted ? "rgba(145,145,145,0.45)" : baseFill,
      stroke: selected ? "#f3d87a" : "#1c1c19",
      strokeWidth: selected ? 2 : 1,
      halo: selected ? "rgba(243,216,122,0.18)" : compared ? "rgba(224,154,172,0.16)" : "transparent",
      radius: selected ? 1.35 : 0.9,
    };
  }

  if (feature.geometry.type === "LineString") {
    return {
      stroke: muted ? "rgba(145,145,145,0.45)" : selected ? "#f3d87a" : "#ef8f45",
      strokeWidth: selected ? 0.85 : 0.5,
      fill: "none",
      dashArray: feature.properties.entityType === "route" ? undefined : "1.2 1.2",
      halo: selected ? "rgba(243,216,122,0.14)" : compared ? "rgba(224,154,172,0.15)" : "transparent",
    };
  }

  return {
    stroke: muted ? "rgba(145,145,145,0.45)" : selected ? "#f3d87a" : "#8f7350",
    strokeWidth: selected ? 0.5 : 0.28,
    fill: muted ? "rgba(145,145,145,0.08)" : selected ? "rgba(243,216,122,0.18)" : "rgba(217,191,93,0.12)",
    dashArray: undefined,
    halo: compared ? "rgba(224,154,172,0.15)" : "transparent",
  };
}

function isPointFeature(feature: Feature): feature is PointFeature {
  return feature.geometry.type === "Point";
}

function formatBBox(bbox?: BBox) {
  if (!bbox) return "—";
  return `${bbox[0].toFixed(3)}, ${bbox[1].toFixed(3)} → ${bbox[2].toFixed(3)}, ${bbox[3].toFixed(3)}`;
}

export default function IntelligenceWorkspace() {
  const [features] = useState<Feature[]>(createExampleCollection());
  const [selectedId, setSelectedId] = useState("ZON-021");
  const [query, setQuery] = useState("");
  const [comparedIds, setComparedIds] = useState<string[]>(["STE-203"]);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zones: true,
    routes: true,
    incidents: true,
    sites: false,
  });
  const [extentMode, setExtentMode] = useState<ExtentMode>("operational");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("flat-map");

  const visibleFeatures = useMemo(() => {
    return features.filter((feature) => {
      const layerKey = entityLayer(feature.properties.entityType);
      return visibleLayers[layerKey] && featureMatchesQuery(feature, query);
    });
  }, [features, query, visibleLayers]);

  const selectedFeature =
    visibleFeatures.find((feature) => feature.properties.id === selectedId) ||
    features.find((feature) => feature.properties.id === selectedId) ||
    features[0];

  const selectedBBox = computeFeatureBBox(selectedFeature);
  const comparedFeatures = comparedIds
    .map((id) => features.find((feature) => feature.properties.id === id))
    .filter((feature): feature is Feature => Boolean(feature));
  const compareBBox = comparedFeatures.reduce<BBox | undefined>((acc, feature) => mergeBBoxes(acc, computeFeatureBBox(feature)), undefined);
  const operationalBBox = computeCollectionBBox(visibleFeatures.length ? visibleFeatures : features);
  const activeBBox = useMemo(() => {
    const chosen =
      extentMode === "selection"
        ? selectedBBox
        : extentMode === "compare"
          ? compareBBox ?? selectedBBox
          : operationalBBox ?? selectedBBox;
    return expandBBox(chosen);
  }, [compareBBox, extentMode, operationalBBox, selectedBBox]);

  const dossierCards = useMemo(() => {
    return [...visibleFeatures].sort((a, b) => PRIORITY_RANK[b.properties.priority] - PRIORITY_RANK[a.properties.priority]);
  }, [visibleFeatures]);

  const selectionAnchor =
    selectedFeature.geometry.type === "Point"
      ? selectedFeature.geometry.coordinates
      : selectedFeature.geometry.type === "LineString"
        ? selectedFeature.geometry.coordinates[Math.floor(selectedFeature.geometry.coordinates.length / 2)]
        : selectedFeature.geometry.coordinates[0][0];

  const selectionProjection = projectPoint(selectionAnchor, activeBBox);
  const selectionOblique = projectOblique(selectionAnchor, activeBBox);
  const incidentFeatures = visibleFeatures.filter(
    (feature): feature is PointFeature =>
      isPointFeature(feature) && (feature.properties.entityType === "incident" || feature.properties.entityType === "site")
  );
  const ringSizes = [10, 18, 28, 38, 52];

  const toggleCompare = (id: string) => {
    setComparedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const renderFlatMap = () => (
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
            const compared = comparedIds.includes(feature.properties.id);
            const selected = feature.properties.id === selectedFeature.properties.id;
            const style = styleForFeature(feature, { selected, compared, muted: false });
            return (
              <path
                key={feature.properties.id}
                d={toSvgPath(feature, activeBBox)}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
              />
            );
          })}

        {visibleFeatures
          .filter((feature) => feature.geometry.type === "LineString")
          .map((feature) => {
            const compared = comparedIds.includes(feature.properties.id);
            const selected = feature.properties.id === selectedFeature.properties.id;
            const style = styleForFeature(feature, { selected, compared, muted: false });
            return (
              <g key={feature.properties.id}>
                {selected && <path d={toSvgPath(feature, activeBBox)} fill="none" stroke={style.halo} strokeWidth={1.35} />}
                <path
                  d={toSvgPath(feature, activeBBox)}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.dashArray}
                />
              </g>
            );
          })}
      </svg>

      {visibleFeatures
        .filter(isPointFeature)
        .map((feature) => {
          const compared = comparedIds.includes(feature.properties.id);
          const selected = feature.properties.id === selectedFeature.properties.id;
          const style = styleForFeature(feature, { selected, compared, muted: false });
          const point = projectPoint(feature.geometry.coordinates, activeBBox);
          return (
            <button
              key={feature.properties.id}
              type="button"
              onClick={() => setSelectedId(feature.properties.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
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

      <motion.div layout className="absolute left-6 top-6 max-w-sm rounded-[24px] border border-zinc-700/80 bg-[#171812]/95 p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-[#d1b16d]" /> Interaction Spine
        </div>
        <div className="mt-2 text-lg font-medium text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
        <div className="mt-1 text-sm text-zinc-400">{selectedFeature.properties.labelSecondary}</div>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em]">
          <span className="rounded-full border border-zinc-700 bg-[#1f2019] px-2 py-1 text-zinc-300">{selectedFeature.properties.id}</span>
          <span className="rounded-full border border-zinc-700 bg-[#1f2019] px-2 py-1 text-zinc-300">{selectedFeature.geometry.type}</span>
          <span className="rounded-full border border-zinc-700 bg-[#1f2019] px-2 py-1 text-zinc-300">{selectedFeature.properties.confidence} confidence</span>
          <span className="rounded-full border border-zinc-700 bg-[#1f2019] px-2 py-1 text-zinc-300">{selectedFeature.properties.regionCode}</span>
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute rounded-full border border-dashed border-[#d1b16d]/55"
        style={{
          left: `${selectionProjection.x}%`,
          top: `${selectionProjection.y}%`,
          width: "90px",
          height: "90px",
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );

  const renderEOOverlay = () => (
    <>
      <div className="absolute inset-0 bg-[#5d5a55]" />
      <div className="absolute inset-0 opacity-80" style={{ background: "linear-gradient(135deg, rgba(20,20,20,0.12), rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.18))" }} />
      <div className="absolute inset-y-0 right-[12%] w-[18%] bg-[rgba(40,40,40,0.12)] blur-[2px]" />
      <div className="absolute left-[10%] top-[18%] h-[60%] w-[18%] rounded-[120px] bg-[rgba(20,30,20,0.28)] blur-[18px]" />

      <div className="absolute left-[55%] top-[24%] h-[17%] w-[14%] border-[3px] border-red-500/90" />
      {[
        [50, 16, 11, 6],
        [50, 25, 11, 6],
        [49, 34, 11, 6],
        [48, 43, 10, 6],
        [43, 57, 15, 7],
        [42, 65, 14, 7],
        [41, 73, 15, 7],
      ].map(([x, y, w, h], index) => (
        <div key={`${x}-${y}-${index}`} className="absolute border-[3px] border-amber-400/95" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
      ))}
      {[
        [40, 48, 12, 13],
        [44, 33, 12, 14],
        [48, 56, 14, 16],
        [66, 13, 11, 4],
      ].map(([x, y, w, h], index) => (
        <div key={`${x}-${y}-${index}`} className="absolute border-[3px] border-blue-500/90" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }} />
      ))}

      <div className="absolute left-[52%] top-[41%] h-[34%] w-[34%] rounded-full border border-cyan-300/55" />
      <div className="absolute left-[62%] top-[53%] h-[10px] w-[18%] origin-left rotate-[-20deg] bg-cyan-300/70" />
      <div className="absolute left-[74%] top-[48%] text-xs text-zinc-100">20m</div>
      {[
        [64, 36, "N"],
        [56, 57, "S"],
        [48, 43, "W"],
        [80, 63, "E"],
      ].map(([x, y, label]) => (
        <div key={label as string} className="absolute text-xs font-medium text-zinc-100/80" style={{ left: `${x}%`, top: `${y}%` }}>{label}</div>
      ))}

      {incidentFeatures.map((feature) => {
        const point = projectPoint(feature.geometry.type === "Point" ? feature.geometry.coordinates : selectionAnchor, activeBBox);
        return (
          <button
            key={feature.properties.id}
            type="button"
            onClick={() => setSelectedId(feature.properties.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-800 bg-zinc-100 shadow-[0_0_0_4px_rgba(20,20,20,0.16)]"
            style={{ left: `${point.x}%`, top: `${point.y}%`, width: "14px", height: "14px" }}
          />
        );
      })}

      <div className="absolute inset-x-0 top-0 h-16 bg-black/40" />
      <div className="absolute left-0 top-0 flex h-16 items-center gap-3 px-5 text-sm text-zinc-100">
        <div className="rounded-md bg-blue-600 px-3 py-2 text-xs font-medium">Tag</div>
        <div className="text-zinc-400">03MAY2024 22:37:02Z</div>
      </div>
      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-md border border-zinc-300/20 bg-black/55 px-20 py-3 text-2xl font-medium text-zinc-100">
        Overhead Interrogation
      </div>
    </>
  );

  const renderSite3D = () => (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b7c8d6_0%,#9aa2a8_18%,#0f1110_19%,#10100f_100%)]" />
      <div
        className="absolute left-[-10%] top-[40%] h-[90%] w-[130%] rounded-[40px] border border-white/5 opacity-60"
        style={{ transform: "perspective(1000px) rotateX(72deg)" }}
      />
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
          const compared = comparedIds.includes(feature.properties.id);
          const selected = feature.properties.id === selectedFeature.properties.id;
          const style = styleForFeature(feature, { selected, compared, muted: false });
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
      ].map((marker, index) => (
        <div key={`${marker.label}-${index}`} className="absolute" style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
          <div className="h-0 w-0 -translate-x-1/2 border-x-[18px] border-b-[34px] border-x-transparent border-b-[#d78183]/78" />
          <div className="mt-1 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-zinc-100/85">{marker.label}</div>
        </div>
      ))}

      <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#d6dd7b]/90" style={{ left: `${selectionOblique.x}%`, top: `${selectionOblique.y}%`, width: "128px", height: "128px" }} />

      <div className="absolute left-5 top-4 rounded-md border border-[#b0bf63]/25 bg-black/55 px-4 py-3 text-sm text-zinc-100">
        <span className="mr-2 text-zinc-400">SELECTED:</span>
        <span className="font-medium">{selectedFeature.properties.labelPrimary}</span>
        <span className="mx-4 text-zinc-500">Building</span>
        <span className="text-zinc-300">Aimpoints (3x)</span>
        <button type="button" className="ml-4 rounded-sm border border-[#b0bf63]/40 px-3 py-1 text-[#d6dd7b]">
          Task Asset
        </button>
      </div>
    </>
  );

  const renderTheater3D = () => (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(110,110,110,0.18),rgba(0,0,0,0.88)_50%)]" />
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div className="absolute left-[4%] top-[18%] h-[52%] w-[44%] rounded-r-[240px] bg-white/12 blur-[2px]" />

      <div className="absolute left-5 top-4 rounded-md border border-[#b0bf63]/25 bg-black/65 px-4 py-3 text-sm text-zinc-100">
        <span className="mr-2 text-zinc-400">ASSIGN ASSET:</span>
        <span className="font-medium">{selectedFeature.properties.labelPrimary}</span>
        <span className="mx-3 text-zinc-500">›</span>
        <span className="text-zinc-300">Dragnet71-11-2</span>
        <span className="ml-2 text-zinc-500">Flight</span>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {ringSizes.map((size, index) => (
          <ellipse
            key={size}
            cx={selectionOblique.x}
            cy={selectionOblique.y + 2}
            rx={size}
            ry={size * 0.52}
            fill="none"
            stroke={index === ringSizes.length - 1 ? "#d6dd7b" : "rgba(214,221,123,0.65)"}
            strokeWidth={index === ringSizes.length - 1 ? 0.35 : 0.2}
          />
        ))}

        {[
          [selectionOblique.x, selectionOblique.y + 2, 11, 13],
          [selectionOblique.x, selectionOblique.y + 2, 76, 18],
          [selectionOblique.x, selectionOblique.y + 2, 54, 70],
        ].map(([x1, y1, x2, y2], index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e2c46b" strokeWidth={0.4} />
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
      ].map(([x, y, label], index) => (
        <div key={`${label}-${index}`} className="absolute text-sm font-medium text-zinc-100/78" style={{ left: `${x}%`, top: `${y}%` }}>
          {label}
        </div>
      ))}
    </>
  );

  const renderOpsWall = () => (
    <div className="absolute inset-0 bg-[#090909] p-6">
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        {["MEXICO", "NEPAL", "ALGIERS", "ARCTIC", "MADRID", "DUBAI", "CAIRO", "SEOUL"].map((city, index) => (
          <div key={city} className="rounded-md border border-zinc-800 bg-black px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{city}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-red-500">{String((19 + index) % 24).padStart(2, "0")}:30</div>
          </div>
        ))}
      </div>

      <div className="grid h-[calc(100%-94px)] grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)_280px]">
        <div className="space-y-4">
          {["Mission Queue", "Asset Status", "Alerts"].map((panel) => (
            <div key={panel} className="rounded-xl border border-zinc-800 bg-[#101113] p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{panel}</div>
              <div className="mt-3 space-y-2 text-sm text-zinc-300">
                <div className="rounded-lg border border-zinc-800 bg-black/40 p-2">Transloading Facility · active tasking</div>
                <div className="rounded-lg border border-zinc-800 bg-black/40 p-2">Dragnet71-11-2 · in range envelope</div>
                <div className="rounded-lg border border-zinc-800 bg-black/40 p-2">Checkpoint Delta Event · medium confidence</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0e1012]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,240,240,0.08),rgba(0,0,0,0.72)_55%)]" />
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {ringSizes.map((size) => (
              <ellipse key={size} cx="52" cy="48" rx={size + 4} ry={(size + 4) * 0.62} fill="none" stroke="rgba(214,221,123,0.35)" strokeWidth="0.3" />
            ))}
            <line x1="52" y1="48" x2="87" y2="22" stroke="#e2c46b" strokeWidth="0.4" />
            <line x1="52" y1="48" x2="36" y2="18" stroke="#e2c46b" strokeWidth="0.4" />
            <line x1="52" y1="48" x2="60" y2="78" stroke="#e2c46b" strokeWidth="0.4" />
          </svg>
          <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.18),rgba(45,60,110,0.25),rgba(0,0,0,0.55))]" />
          <div className="absolute bottom-5 left-1/2 w-[340px] -translate-x-1/2 rounded-xl border border-zinc-700 bg-black/65 p-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Central mission surface</div>
            <div className="mt-2 text-zinc-200">Global monitoring, range geometry, cross-domain asset assignment</div>
          </div>
        </div>

        <div className="space-y-4">
          {["Map Analytics", "Freshness Summary", "Confidence Split"].map((panel) => (
            <div key={panel} className="rounded-xl border border-zinc-800 bg-[#101113] p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{panel}</div>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-20 w-20 rounded-full border-8 border-zinc-700 border-t-[#b7ca52] border-r-[#ef8f45]" />
                <div className="text-sm text-zinc-300">
                  <div>Operational: {visibleFeatures.length}</div>
                  <div>Compared: {comparedIds.length}</div>
                  <div>Extent mode: {extentMode}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMainSurface = () => {
    switch (workspaceMode) {
      case "eo-overlay":
        return renderEOOverlay();
      case "site-3d":
        return renderSite3D();
      case "theater-3d":
        return renderTheater3D();
      case "ops-wall":
        return renderOpsWall();
      default:
        return renderFlatMap();
    }
  };

  return (
    <div className="bg-[#11120f] p-4 text-zinc-100 md:p-6">
      <div className="mx-auto max-w-[1620px] overflow-hidden rounded-[30px] border border-zinc-800 bg-[#161713] shadow-workspace-xl">
        <div className="grid min-h-[900px] grid-cols-1 xl:grid-cols-[94px_360px_minmax(0,1fr)_400px]">
          <aside className="flex gap-3 border-b border-zinc-800 bg-[#12130f] p-3 xl:flex-col xl:gap-2 xl:border-b-0 xl:border-r">
            {[MapPinned, AlertTriangle, Route, FileText, Layers3].map((Icon, index) => (
              <button
                type="button"
                key={index}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${index === 0 ? "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]" : "border-zinc-800 bg-[#181914] text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"}`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
            <div className="mt-auto hidden rounded-2xl border border-zinc-800 bg-[#181914] p-3 text-[11px] uppercase tracking-[0.18em] text-zinc-500 xl:block">
              Geo Core Live
            </div>
          </aside>

          <aside className="border-b border-zinc-800 bg-[#181914] p-5 xl:border-b-0 xl:border-r">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Field Archive / Operational Index</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Intelligence Workspace</div>
              <div className="mt-1 text-sm text-zinc-400">Five screen families, shared selection state, geometry-first rendering.</div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-[#11120f] px-3 py-3">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search IDs, region codes, titles"
                className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-[#13140f] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <Monitor className="h-4 w-4 text-[#d1b16d]" /> Screen Families
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Mode switch</div>
              </div>
              <div className="space-y-2">
                {MODES.map(({ id, label, description, Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setWorkspaceMode(id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${workspaceMode === id ? "border-[#d1b16d] bg-[#232116]" : "border-zinc-800 bg-[#181914] hover:border-zinc-700"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${workspaceMode === id ? "border-[#d1b16d]/50 bg-[#2a2618] text-[#e4c97f]" : "border-zinc-700 bg-[#141510] text-zinc-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-100">{label}</div>
                        <div className="text-xs text-zinc-500">{description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-[#13140f] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <Filter className="h-4 w-4 text-[#d1b16d]" /> Active Layers
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Query scoped</div>
              </div>
              <div className="space-y-2">
                {LAYERS.map((layer) => {
                  const active = visibleLayers[layer.id];
                  return (
                    <button
                      type="button"
                      key={layer.id}
                      onClick={() => setVisibleLayers((prev) => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${active ? "border-zinc-700 bg-[#1b1c16] text-zinc-100" : "border-zinc-900 bg-[#12130f] text-zinc-500"}`}
                    >
                      <span>{layer.label}</span>
                      {active ? <Eye className="h-4 w-4 text-[#ef8f45]" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-[#13140f] p-3">
              <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Extent Mode</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["operational", "Operational"],
                  ["selection", "Selection"],
                  ["compare", "Compare"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setExtentMode(value as ExtentMode)}
                    className={`rounded-xl border px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${extentMode === value ? "border-[#d1b16d] bg-[#232116] text-[#e4c97f]" : "border-zinc-800 bg-[#181914] text-zinc-400 hover:border-zinc-700 hover:text-zinc-100"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-[#13140f] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-200">
                  <Layers3 className="h-4 w-4 text-[#d1b16d]" /> Operational Index
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{dossierCards.length} visible</div>
              </div>
              <div className="space-y-3 overflow-auto pr-1 xl:max-h-[calc(100vh-560px)]">
                {dossierCards.map((feature) => {
                  const selected = feature.properties.id === selectedFeature.properties.id;
                  const compared = comparedIds.includes(feature.properties.id);
                  return (
                    <motion.div
                      layout
                      key={feature.properties.id}
                      onClick={() => setSelectedId(feature.properties.id)}
                      className={`cursor-pointer rounded-[22px] border p-4 transition ${selected ? "border-[#d1b16d] bg-[#232116] shadow-[0_0_0_1px_rgba(209,177,109,0.2)]" : "border-zinc-800 bg-[#141510] hover:border-zinc-700"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{feature.properties.id}</div>
                          <div className="mt-1 text-base font-medium text-zinc-100">{feature.properties.labelPrimary}</div>
                          <div className="mt-1 text-sm text-zinc-400">{feature.properties.labelSecondary}</div>
                        </div>
                        <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${statusClasses(feature.properties.operationalState)}`}>
                          {feature.properties.operationalState}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div className="text-xs text-zinc-500">{feature.properties.timeLabel}</div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleCompare(feature.properties.id);
                          }}
                          className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] transition ${compared ? "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]" : "border-zinc-700 bg-[#1b1c16] text-zinc-300 hover:border-zinc-500"}`}
                        >
                          {compared ? "Pinned" : "Compare"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="border-b border-zinc-800 bg-[#151611] xl:border-b-0">
            <div className="flex flex-col gap-3 border-b border-zinc-800 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Region Scope</div>
                <div className="mt-1 text-lg font-medium text-zinc-100">Eastern Sector Review</div>
                <div className="mt-1 text-sm text-zinc-400">{topBarTitle(workspaceMode)}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setExtentMode("selection")}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-[#191a14] px-3 py-2 text-sm text-zinc-200 transition hover:bg-[#20221a] hover:text-zinc-100"
                >
                  <Crosshair className="h-4 w-4" /> Center Selection
                </button>
                <button
                  type="button"
                  onClick={() => setExtentMode("compare")}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-[#191a14] px-3 py-2 text-sm text-zinc-200 transition hover:bg-[#20221a] hover:text-zinc-100"
                >
                  <LocateFixed className="h-4 w-4" /> Frame Compare
                </button>
                <button
                  type="button"
                  onClick={() => setExtentMode("operational")}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-[#191a14] px-3 py-2 text-sm text-zinc-200 transition hover:bg-[#20221a] hover:text-zinc-100"
                >
                  <TimerReset className="h-4 w-4" /> Operational Scope
                </button>
              </div>
            </div>

            <div className="relative min-h-[760px] overflow-hidden">
              {renderMainSurface()}

              <div className="pointer-events-none absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Visible Objects", value: `${visibleFeatures.length}`, note: "Current operational scope" },
                  { label: "Compared Items", value: `${comparedIds.length}`, note: "Pinned for compare bbox" },
                  { label: "Active BBox", value: formatBBox(activeBBox), note: `Mode: ${extentMode}` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[22px] border border-zinc-700/70 bg-[#171812]/90 p-4 shadow-2xl backdrop-blur-sm">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{stat.label}</div>
                    <div className="mt-2 text-lg font-semibold tracking-tight text-zinc-100">{stat.value}</div>
                    <div className="mt-1 text-sm text-zinc-400">{stat.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          <aside className="bg-[#191a15] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Dossier Detail</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">{selectedFeature.properties.labelPrimary}</div>
              </div>
              <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${statusClasses(selectedFeature.properties.operationalState)}`}>
                {selectedFeature.properties.operationalState}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                ["ID", selectedFeature.properties.id],
                ["Type", selectedFeature.properties.entityType],
                ["Priority", selectedFeature.properties.priority],
                ["Freshness", selectedFeature.properties.freshness],
                ["Confidence", selectedFeature.properties.confidence],
                ["Region", selectedFeature.properties.regionCode],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-zinc-800 bg-[#13140f] p-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
                  <div className="mt-2 text-sm font-medium text-zinc-100">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border border-zinc-800 bg-[#13140f] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Summary</div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{selectedFeature.properties.summary}</p>
            </div>

            <div className="mt-4 rounded-[24px] border border-zinc-800 bg-[#13140f] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Evidence References</div>
                <button
                  type="button"
                  onClick={() => toggleCompare(selectedFeature.properties.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] transition ${comparedIds.includes(selectedFeature.properties.id) ? "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]" : "border-zinc-700 bg-[#181914] text-zinc-300 hover:border-zinc-500"}`}
                >
                  <Plus className="h-3 w-3" />
                  {comparedIds.includes(selectedFeature.properties.id) ? "Pinned" : "Pin Compare"}
                </button>
              </div>
              <div className="space-y-2">
                {selectedFeature.properties.evidenceRefs.map((ref) => (
                  <div key={ref} className="rounded-2xl border border-zinc-800 bg-[#181914] px-3 py-3">
                    <div className="text-sm text-zinc-100">{ref}</div>
                    <div className="mt-1 text-xs text-zinc-500">Linked to current selection and geometry context</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-zinc-800 bg-[#13140f] p-4">
              <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Compare Queue</div>
              <div className="space-y-2">
                {comparedFeatures.length ? (
                  comparedFeatures.map((feature) => (
                    <div key={feature.properties.id} className="rounded-2xl border border-zinc-800 bg-[#181914] px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm text-zinc-100">{feature.properties.labelPrimary}</div>
                          <div className="mt-1 text-xs text-zinc-500">{feature.properties.id} · {feature.properties.entityType}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCompare(feature.properties.id)}
                          className="rounded-full border border-zinc-700 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-300 hover:border-zinc-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-800 bg-[#181914] px-3 py-4 text-sm text-zinc-500">
                    No compared items yet. Use the compare buttons in the index or detail pane.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-zinc-800 bg-[#13140f] p-4">
              <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Behavior Spine</div>
              <div className="space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-zinc-800 bg-[#181914] p-3">Selection propagates across dossier card, primary surface, and detail panel.</div>
                <div className="rounded-2xl border border-zinc-800 bg-[#181914] p-3">Extent mode changes the framing bbox without resetting selection or compare state.</div>
                <div className="rounded-2xl border border-zinc-800 bg-[#181914] p-3">Mode switches preserve object identity while changing the viewing surface.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
