import { T } from "./config";
import type {
  BBox,
  EntityType,
  Feature,
  Geometry,
  OperationalState,
  Position,
  WorkspaceMode,
} from "./types";

const MAP_PADDING = 0.08;

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

export function destinationPoint(origin: Position, bearingDegrees: number, distanceMeters: number): Position {
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

export function approximateCircle(center: Position, radiusMeters: number, steps = 72): Position[] {
  const ring: Position[] = [];
  for (let i = 0; i < steps; i += 1) {
    ring.push(destinationPoint(center, (i / steps) * 360, radiusMeters));
  }
  ring.push(ring[0]);
  return ring;
}

export function computeGeometryBBox(geometry: Geometry): BBox {
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

export function computeFeatureBBox(feature: Feature): BBox {
  return computeGeometryBBox(feature.geometry);
}

export function mergeBBoxes(a?: BBox, b?: BBox): BBox | undefined {
  if (!a) return b ? ([...b] as BBox) : undefined;
  if (!b) return [...a] as BBox;
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
}

export function computeCollectionBBox(features: Feature[]): BBox | undefined {
  return features.reduce<BBox | undefined>((acc, feature) => mergeBBoxes(acc, computeFeatureBBox(feature)), undefined);
}

export function expandBBox(bbox: BBox, ratio = MAP_PADDING): BBox {
  const width = bbox[2] - bbox[0] || 0.01;
  const height = bbox[3] - bbox[1] || 0.01;
  return [bbox[0] - width * ratio, bbox[1] - height * ratio, bbox[2] + width * ratio, bbox[3] + height * ratio];
}

export function projectPoint(position: Position, bbox: BBox) {
  const width = bbox[2] - bbox[0] || 1;
  const height = bbox[3] - bbox[1] || 1;
  const x = ((position[0] - bbox[0]) / width) * 100;
  const y = 100 - ((position[1] - bbox[1]) / height) * 100;
  return { x, y };
}

export function projectOblique(position: Position, bbox: BBox) {
  const flat = projectPoint(position, bbox);
  const y = 22 + flat.y * 0.56;
  const x = 8 + flat.x * 0.86 + (50 - flat.y) * 0.14;
  return { x, y };
}

export function toSvgPath(feature: Feature, bbox: BBox, projection: "flat" | "oblique" = "flat") {
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

export function entityLayer(entityType: EntityType) {
  if (entityType === "incident") return "incidents";
  if (entityType === "route") return "routes";
  if (entityType === "zone") return "zones";
  return "sites";
}

export function featureMatchesQuery(feature: Feature, query: string) {
  if (!query.trim()) return true;
  const haystack = `${feature.properties.id} ${feature.properties.labelPrimary} ${feature.properties.labelSecondary} ${feature.properties.regionCode}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function statusClasses(state: OperationalState) {
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

export function styleForFeature(feature: Feature, options: { selected: boolean; compared: boolean; muted: boolean }) {
  const { selected, compared, muted } = options;

  if (feature.geometry.type === "Point") {
    const baseFill =
      feature.properties.operationalState === "alert"
        ? T.accentOrange
        : feature.properties.entityType === "site"
          ? T.secondary
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
      stroke: muted ? "rgba(145,145,145,0.45)" : selected ? "#f3d87a" : T.accentOrange,
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

export function formatBBox(bbox?: BBox) {
  if (!bbox) return "—";
  return `${bbox[0].toFixed(3)}, ${bbox[1].toFixed(3)} → ${bbox[2].toFixed(3)}, ${bbox[3].toFixed(3)}`;
}

export function topBarSubtitle(mode: WorkspaceMode) {
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
