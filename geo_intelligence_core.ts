/*
  Geo Intelligence Core
  ---------------------
  This file adds the missing map-intelligence layer for the Field Archive system.

  Purpose:
  - Treat GeoJSON as the canonical map data language
  - Preserve spatial truth before UI styling
  - Support projection-aware overlays and edge cases
  - Provide deterministic style resolution from geometry + semantics + state

  Notes:
  - GeoJSON does not have a native Circle geometry, so circles/range overlays
    must be approximated as polygons from sampled coordinates.
  - Antimeridian and polar edge cases must be handled explicitly.
  - This is framework-ready TypeScript intended to sit underneath React/MapLibre/deck.gl.
*/

// -----------------------------------------------------------------------------
// 1. Core GeoJSON Types
// -----------------------------------------------------------------------------

export type Position = [longitude: number, latitude: number] | [longitude: number, latitude: number, elevation: number];
export type BBox = [west: number, south: number, east: number, north: number];

export interface PointGeometry {
  type: "Point";
  coordinates: Position;
}

export interface MultiPointGeometry {
  type: "MultiPoint";
  coordinates: Position[];
}

export interface LineStringGeometry {
  type: "LineString";
  coordinates: Position[];
}

export interface MultiLineStringGeometry {
  type: "MultiLineString";
  coordinates: Position[][];
}

export interface PolygonGeometry {
  type: "Polygon";
  coordinates: Position[][];
}

export interface MultiPolygonGeometry {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

export interface GeometryCollectionGeometry {
  type: "GeometryCollection";
  geometries: Geometry[];
}

export type Geometry =
  | PointGeometry
  | MultiPointGeometry
  | LineStringGeometry
  | MultiLineStringGeometry
  | PolygonGeometry
  | MultiPolygonGeometry
  | GeometryCollectionGeometry;

export interface GeoFeatureProperties {
  id?: string;
  entityType?:
    | "incident"
    | "site"
    | "asset"
    | "sensor"
    | "checkpoint"
    | "route"
    | "corridor"
    | "boundary"
    | "zone"
    | "sector"
    | "region"
    | "report"
    | "observation"
    | "source"
    | string;
  operationalState?:
    | "default"
    | "active"
    | "selected"
    | "filtered"
    | "muted"
    | "disabled"
    | "stale"
    | "alert"
    | "loading"
    | "error"
    | "archived"
    | "simulated"
    | "resolved";
  priority?: "low" | "medium" | "high" | "critical";
  confidence?: "low" | "medium" | "high" | "confirmed";
  freshness?: "recent" | "aging" | "stale" | "unknown";
  sourceClass?:
    | "sensor_ingest"
    | "human_report"
    | "derived_analysis"
    | "external_feed"
    | "manual_entry"
    | "system_generated"
    | "historical_archive"
    | "simulation"
    | "unknown";
  labelPrimary?: string;
  labelSecondary?: string;
  regionCode?: string;
  timeStart?: string | null;
  timeEnd?: string | null;
  lastObservedAt?: string | null;
  lastVerifiedAt?: string | null;
  evidenceRefs?: string[];
  [key: string]: unknown;
}

export interface GeoJSONFeature<P extends GeoFeatureProperties = GeoFeatureProperties> {
  type: "Feature";
  id?: string | number;
  bbox?: BBox;
  geometry: Geometry | null;
  properties: P;
}

export interface GeoJSONFeatureCollection<P extends GeoFeatureProperties = GeoFeatureProperties> {
  type: "FeatureCollection";
  bbox?: BBox;
  features: GeoJSONFeature<P>[];
}

// -----------------------------------------------------------------------------
// 2. View State + Render State Contracts
// -----------------------------------------------------------------------------

export interface GeoSelectionState {
  selectedFeatureId?: string;
  hoveredFeatureId?: string;
  comparedFeatureIds?: string[];
  focusedEvidenceRefId?: string;
}

export interface GeoFilterState {
  entityTypes?: string[];
  operationalStates?: string[];
  priorities?: string[];
  confidenceLevels?: string[];
  freshnessLevels?: string[];
  sourceClasses?: string[];
  regionCodes?: string[];
  query?: string;
  timeStart?: string | null;
  timeEnd?: string | null;
}

export interface GeoMapViewState {
  zoom: number;
  center?: Position;
  bbox?: BBox;
  bearing?: number;
  pitch?: number;
}

export interface GeoRenderContext {
  selection: GeoSelectionState;
  filters: GeoFilterState;
  mapView: GeoMapViewState;
}

export interface MapStyleDescriptor {
  layerKind: "point" | "line" | "polygon" | "label" | "overlay";
  visible: boolean;
  zIndex: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  fillOpacity?: number;
  radius?: number;
  dashArray?: number[];
  haloColor?: string;
  haloWidth?: number;
  labelText?: string;
  labelPriority?: "primary" | "secondary" | "suppressed";
}

export interface ResolvedFeatureRenderState {
  featureId: string;
  geometryType: Geometry["type"] | "Null";
  style: MapStyleDescriptor;
}

// -----------------------------------------------------------------------------
// 3. Geographic Math Utilities
// -----------------------------------------------------------------------------

const EARTH_RADIUS_METERS = 6371008.8;
const MAX_MERCATOR_LAT = 85.05112878;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function normalizeLongitude(lng: number): number {
  let normalized = ((lng + 180) % 360 + 360) % 360 - 180;
  if (normalized === -180) normalized = 180;
  return normalized;
}

export function clampMercatorLatitude(lat: number): number {
  return Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, lat));
}

export function haversineDistanceMeters(a: Position, b: Position): number {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lng2 - lng1);

  const h =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function destinationPoint(origin: Position, bearingDegrees: number, distanceMeters: number): Position {
  const [lng, lat] = origin;
  const theta = toRadians(bearingDegrees);
  const delta = distanceMeters / EARTH_RADIUS_METERS;
  const phi1 = toRadians(lat);
  const lambda1 = toRadians(lng);

  const sinPhi2 = Math.sin(phi1) * Math.cos(delta) + Math.cos(phi1) * Math.sin(delta) * Math.cos(theta);
  const phi2 = Math.asin(sinPhi2);

  const y = Math.sin(theta) * Math.sin(delta) * Math.cos(phi1);
  const x = Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2);
  const lambda2 = lambda1 + Math.atan2(y, x);

  return [normalizeLongitude(toDegrees(lambda2)), clampMercatorLatitude(toDegrees(phi2))];
}

// -----------------------------------------------------------------------------
// 4. Circle / Range Overlay Logic
// -----------------------------------------------------------------------------

export interface RangeOverlayOptions {
  steps?: number;
  includeBBox?: boolean;
}

export interface RangeOverlayResult {
  center: Position;
  radiusMeters: number;
  polygon: PolygonGeometry;
  bbox: BBox;
  crossesAntimeridian: boolean;
  approachesPolarLimit: boolean;
}

export function approximateGeodesicCircle(
  center: Position,
  radiusMeters: number,
  options: RangeOverlayOptions = {}
): RangeOverlayResult {
  const steps = Math.max(24, options.steps ?? 64);
  const ring: Position[] = [];

  for (let i = 0; i < steps; i += 1) {
    const bearing = (i / steps) * 360;
    ring.push(destinationPoint(center, bearing, radiusMeters));
  }

  ring.push(ring[0]);

  const polygon: PolygonGeometry = {
    type: "Polygon",
    coordinates: [ring],
  };

  const bbox = computeGeometryBBox(polygon);
  const crosses = ringCrossesAntimeridian(ring);
  const polar = ring.some(([, lat]) => Math.abs(lat) >= 80);

  return {
    center,
    radiusMeters,
    polygon,
    bbox,
    crossesAntimeridian: crosses,
    approachesPolarLimit: polar,
  };
}

// -----------------------------------------------------------------------------
// 5. Antimeridian Utilities
// -----------------------------------------------------------------------------

export function longitudeDelta(a: number, b: number): number {
  return Math.abs(normalizeLongitude(a) - normalizeLongitude(b));
}

export function segmentCrossesAntimeridian(a: Position, b: Position): boolean {
  return longitudeDelta(a[0], b[0]) > 180;
}

export function ringCrossesAntimeridian(ring: Position[]): boolean {
  for (let i = 0; i < ring.length - 1; i += 1) {
    if (segmentCrossesAntimeridian(ring[i], ring[i + 1])) return true;
  }
  return false;
}

export function unwrapLineString(line: Position[]): Position[] {
  if (line.length === 0) return [];

  const unwrapped: Position[] = [line[0]];

  for (let i = 1; i < line.length; i += 1) {
    const previous = unwrapped[i - 1];
    const current = [...line[i]] as Position;

    while (current[0] - previous[0] > 180) current[0] -= 360;
    while (current[0] - previous[0] < -180) current[0] += 360;

    unwrapped.push(current);
  }

  return unwrapped;
}

export function splitLineStringAtAntimeridian(line: Position[]): Position[][] {
  if (line.length < 2) return [line];

  const parts: Position[][] = [];
  let currentPart: Position[] = [line[0]];

  for (let i = 1; i < line.length; i += 1) {
    const prev = line[i - 1];
    const curr = line[i];

    if (segmentCrossesAntimeridian(prev, curr)) {
      parts.push(currentPart);
      currentPart = [curr];
    } else {
      currentPart.push(curr);
    }
  }

  if (currentPart.length > 0) parts.push(currentPart);
  return parts;
}

// -----------------------------------------------------------------------------
// 6. BBox + Extent Logic
// -----------------------------------------------------------------------------

export function emptyBBox(): BBox {
  return [Infinity, Infinity, -Infinity, -Infinity];
}

export function extendBBox(bbox: BBox, lng: number, lat: number): BBox {
  bbox[0] = Math.min(bbox[0], lng);
  bbox[1] = Math.min(bbox[1], lat);
  bbox[2] = Math.max(bbox[2], lng);
  bbox[3] = Math.max(bbox[3], lat);
  return bbox;
}

export function mergeBBoxes(a?: BBox, b?: BBox): BBox | undefined {
  if (!a && !b) return undefined;
  if (!a) return [...b!] as BBox;
  if (!b) return [...a] as BBox;
  return [
    Math.min(a[0], b[0]),
    Math.min(a[1], b[1]),
    Math.max(a[2], b[2]),
    Math.max(a[3], b[3]),
  ];
}

export function computeGeometryBBox(geometry: Geometry): BBox {
  const bbox = emptyBBox();

  function walkPositions(positions: unknown): void {
    if (!Array.isArray(positions)) return;

    if (positions.length >= 2 && typeof positions[0] === "number" && typeof positions[1] === "number") {
      extendBBox(bbox, normalizeLongitude(positions[0] as number), positions[1] as number);
      return;
    }

    for (const item of positions) walkPositions(item);
  }

  switch (geometry.type) {
    case "GeometryCollection":
      for (const g of geometry.geometries) {
        const childBBox = computeGeometryBBox(g);
        mergeBBoxes(bbox, childBBox);
        extendBBox(bbox, childBBox[0], childBBox[1]);
        extendBBox(bbox, childBBox[2], childBBox[3]);
      }
      return bbox;
    default:
      walkPositions((geometry as Exclude<Geometry, GeometryCollectionGeometry>).coordinates);
      return bbox;
  }
}

export function computeFeatureBBox(feature: GeoJSONFeature): BBox | undefined {
  if (feature.bbox) return feature.bbox;
  if (!feature.geometry) return undefined;
  return computeGeometryBBox(feature.geometry);
}

export function computeCollectionBBox(collection: GeoJSONFeatureCollection): BBox | undefined {
  let result: BBox | undefined;
  for (const feature of collection.features) {
    result = mergeBBoxes(result, computeFeatureBBox(feature));
  }
  return result;
}

// -----------------------------------------------------------------------------
// 7. Feature Filtering + Feature Store
// -----------------------------------------------------------------------------

export class GeoJSONFeatureStore<P extends GeoFeatureProperties = GeoFeatureProperties> {
  private readonly byId = new Map<string, GeoJSONFeature<P>>();
  private collection: GeoJSONFeatureCollection<P> = { type: "FeatureCollection", features: [] };

  load(collection: GeoJSONFeatureCollection<P>): void {
    this.collection = collection;
    this.byId.clear();

    for (const feature of collection.features) {
      const id = this.resolveFeatureId(feature);
      this.byId.set(id, feature);
    }
  }

  getCollection(): GeoJSONFeatureCollection<P> {
    return this.collection;
  }

  getFeatureById(id: string): GeoJSONFeature<P> | undefined {
    return this.byId.get(id);
  }

  getFeatures(): GeoJSONFeature<P>[] {
    return this.collection.features;
  }

  getVisibleFeatures(filters: GeoFilterState): GeoJSONFeature<P>[] {
    return this.collection.features.filter((feature) => featureMatchesFilters(feature, filters));
  }

  computeVisibleBBox(filters: GeoFilterState): BBox | undefined {
    let bbox: BBox | undefined;
    for (const feature of this.getVisibleFeatures(filters)) {
      bbox = mergeBBoxes(bbox, computeFeatureBBox(feature));
    }
    return bbox;
  }

  computeCompareBBox(ids: string[]): BBox | undefined {
    let bbox: BBox | undefined;
    for (const id of ids) {
      const feature = this.byId.get(id);
      if (feature) bbox = mergeBBoxes(bbox, computeFeatureBBox(feature));
    }
    return bbox;
  }

  private resolveFeatureId(feature: GeoJSONFeature<P>): string {
    if (typeof feature.id === "string") return feature.id;
    if (typeof feature.id === "number") return String(feature.id);
    if (typeof feature.properties.id === "string") return feature.properties.id;
    return cryptoSafeId(feature);
  }
}

export function featureMatchesFilters(feature: GeoJSONFeature, filters: GeoFilterState): boolean {
  const p = feature.properties;
  const q = filters.query?.trim().toLowerCase();

  if (filters.entityTypes?.length && p.entityType && !filters.entityTypes.includes(String(p.entityType))) return false;
  if (filters.operationalStates?.length && p.operationalState && !filters.operationalStates.includes(String(p.operationalState))) return false;
  if (filters.priorities?.length && p.priority && !filters.priorities.includes(String(p.priority))) return false;
  if (filters.confidenceLevels?.length && p.confidence && !filters.confidenceLevels.includes(String(p.confidence))) return false;
  if (filters.freshnessLevels?.length && p.freshness && !filters.freshnessLevels.includes(String(p.freshness))) return false;
  if (filters.sourceClasses?.length && p.sourceClass && !filters.sourceClasses.includes(String(p.sourceClass))) return false;
  if (filters.regionCodes?.length && p.regionCode && !filters.regionCodes.includes(String(p.regionCode))) return false;

  if (q) {
    const haystack = [
      p.id,
      p.labelPrimary,
      p.labelSecondary,
      p.entityType,
      p.regionCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(q)) return false;
  }

  return true;
}

function cryptoSafeId(feature: GeoJSONFeature): string {
  const p = feature.properties;
  return [p.entityType ?? "feature", p.labelPrimary ?? "untitled", Math.random().toString(36).slice(2, 8)].join("-");
}

// -----------------------------------------------------------------------------
// 8. Style Resolver
// -----------------------------------------------------------------------------

const palette = {
  ink: "#1c1c19",
  muted: "#6d6f67",
  line: "#8f7350",
  alert: "#ef8f45",
  warning: "#d4a72c",
  active: "#b7ca52",
  trace: "#e09aac",
  verified: "#5fc8d8",
  paper: "#e4dccf",
  zone: "#d9bf5d",
  focus: "#f3d87a",
};

export function resolveFeatureStyle(
  feature: GeoJSONFeature,
  context: GeoRenderContext
): ResolvedFeatureRenderState {
  const featureId = resolveStableFeatureId(feature);
  const geometryType = feature.geometry?.type ?? "Null";
  const p = feature.properties;

  const isSelected = context.selection.selectedFeatureId === featureId;
  const isHovered = context.selection.hoveredFeatureId === featureId;
  const isCompared = context.selection.comparedFeatureIds?.includes(featureId) ?? false;
  const isAlert = p.operationalState === "alert" || p.priority === "critical";
  const isStale = p.freshness === "stale";

  let style: MapStyleDescriptor;

  switch (geometryType) {
    case "Point":
    case "MultiPoint": {
      style = {
        layerKind: "point",
        visible: true,
        zIndex: isSelected ? 70 : 50,
        radius: isSelected ? 7 : isAlert ? 5 : 4,
        fillColor: isAlert ? palette.alert : p.sourceClass === "sensor_ingest" ? palette.verified : palette.paper,
        strokeColor: isSelected ? palette.focus : palette.ink,
        strokeWidth: isSelected ? 2 : 1,
        haloColor: isSelected || isHovered ? palette.focus : undefined,
        haloWidth: isSelected ? 8 : isHovered ? 4 : undefined,
      };
      break;
    }

    case "LineString":
    case "MultiLineString": {
      style = {
        layerKind: "line",
        visible: true,
        zIndex: isSelected ? 60 : 40,
        strokeColor: isSelected ? palette.alert : p.entityType === "boundary" ? palette.muted : palette.alert,
        strokeWidth: isSelected ? 3 : 2,
        dashArray: p.entityType === "boundary" ? [6, 4] : undefined,
        haloColor: isSelected ? palette.focus : undefined,
        haloWidth: isSelected ? 4 : undefined,
      };
      break;
    }

    case "Polygon":
    case "MultiPolygon": {
      style = {
        layerKind: "polygon",
        visible: true,
        zIndex: isSelected ? 30 : 20,
        fillColor: p.operationalState === "selected" ? palette.focus : palette.zone,
        fillOpacity: isSelected ? 0.22 : isStale ? 0.08 : 0.12,
        strokeColor: isSelected ? palette.focus : palette.line,
        strokeWidth: isSelected ? 2 : 1,
        haloColor: isCompared ? palette.trace : undefined,
        haloWidth: isCompared ? 3 : undefined,
      };
      break;
    }

    case "GeometryCollection": {
      style = {
        layerKind: "overlay",
        visible: true,
        zIndex: 80,
        strokeColor: palette.verified,
        strokeWidth: 2,
      };
      break;
    }

    case "Null":
    default: {
      style = {
        layerKind: "label",
        visible: false,
        zIndex: 0,
      };
      break;
    }
  }

  if (context.filters.query && !featureMatchesFilters(feature, context.filters)) {
    style.visible = false;
  }

  return {
    featureId,
    geometryType,
    style,
  };
}

export function resolveLabelVisibility(feature: GeoJSONFeature, mapView: GeoMapViewState): MapStyleDescriptor {
  const p = feature.properties;
  const geometryType = feature.geometry?.type;
  const labelText = p.labelPrimary ?? p.id ?? "";

  if (!labelText) {
    return {
      layerKind: "label",
      visible: false,
      zIndex: 0,
      labelPriority: "suppressed",
    };
  }

  if ((geometryType === "Point" || geometryType === "MultiPoint") && mapView.zoom < 6) {
    return {
      layerKind: "label",
      visible: false,
      zIndex: 0,
      labelPriority: "suppressed",
    };
  }

  return {
    layerKind: "label",
    visible: true,
    zIndex: 90,
    labelText,
    labelPriority: mapView.zoom > 9 ? "primary" : "secondary",
    strokeColor: palette.ink,
    haloColor: palette.paper,
    haloWidth: 2,
  };
}

function resolveStableFeatureId(feature: GeoJSONFeature): string {
  if (typeof feature.id === "string") return feature.id;
  if (typeof feature.id === "number") return String(feature.id);
  if (typeof feature.properties.id === "string") return feature.properties.id;
  return `${feature.properties.entityType ?? "feature"}:${feature.properties.labelPrimary ?? "untitled"}`;
}

// -----------------------------------------------------------------------------
// 9. Overlay Builders for Intelligence Use Cases
// -----------------------------------------------------------------------------

export interface GeoRangeFeatureProperties extends GeoFeatureProperties {
  entityType: "zone" | "sector" | "region" | string;
  overlayType: "range-ring" | "coverage-envelope" | "search-radius";
  radiusMeters: number;
  centerLabel?: string;
}

export function buildRangeOverlayFeature(
  center: Position,
  radiusMeters: number,
  properties: GeoRangeFeatureProperties,
  options?: RangeOverlayOptions
): GeoJSONFeature<GeoRangeFeatureProperties> {
  const range = approximateGeodesicCircle(center, radiusMeters, options);

  return {
    type: "Feature",
    id: properties.id ?? `${properties.overlayType}-${radiusMeters}`,
    bbox: range.bbox,
    geometry: range.polygon,
    properties: {
      ...properties,
      freshness: properties.freshness ?? "recent",
      confidence: properties.confidence ?? "high",
      sourceClass: properties.sourceClass ?? "derived_analysis",
      labelPrimary: properties.labelPrimary ?? properties.centerLabel ?? `Range ${radiusMeters}m`,
    },
  };
}

// -----------------------------------------------------------------------------
// 10. Intelligence-Level Comparison Helpers
// -----------------------------------------------------------------------------

export function computeSelectionExtent(
  store: GeoJSONFeatureStore,
  selection: GeoSelectionState
): BBox | undefined {
  if (selection.selectedFeatureId) {
    const feature = store.getFeatureById(selection.selectedFeatureId);
    if (feature) return computeFeatureBBox(feature);
  }
  return undefined;
}

export function computeCompareExtent(
  store: GeoJSONFeatureStore,
  selection: GeoSelectionState
): BBox | undefined {
  const ids = selection.comparedFeatureIds ?? [];
  if (!ids.length) return undefined;
  return store.computeCompareBBox(ids);
}

export function computeOperationalExtent(
  store: GeoJSONFeatureStore,
  context: GeoRenderContext
): BBox | undefined {
  return computeCompareExtent(store, context.selection)
    ?? computeSelectionExtent(store, context.selection)
    ?? store.computeVisibleBBox(context.filters)
    ?? computeCollectionBBox(store.getCollection());
}

// -----------------------------------------------------------------------------
// 11. Validation + Review Helpers
// -----------------------------------------------------------------------------

export interface ValidationIssue {
  level: "warning" | "error";
  featureId: string;
  message: string;
}

export function validateFeatureForMapIntelligence(feature: GeoJSONFeature): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const featureId = resolveStableFeatureId(feature);

  if (!feature.geometry) {
    issues.push({ level: "warning", featureId, message: "Feature has null geometry." });
    return issues;
  }

  const p = feature.properties;

  if (!p.labelPrimary) {
    issues.push({ level: "warning", featureId, message: "Feature is missing labelPrimary." });
  }

  if (!p.entityType) {
    issues.push({ level: "warning", featureId, message: "Feature is missing entityType." });
  }

  if (feature.geometry.type === "Polygon") {
    const outerRing = feature.geometry.coordinates[0];
    if (!outerRing || outerRing.length < 4) {
      issues.push({ level: "error", featureId, message: "Polygon outer ring is invalid." });
    }
  }

  return issues;
}

// -----------------------------------------------------------------------------
// 12. Example Factory Data
// -----------------------------------------------------------------------------

export function createExampleIntelligenceCollection(): GeoJSONFeatureCollection {
  const rangeZone = buildRangeOverlayFeature(
    [12.49, 41.89],
    3000,
    {
      id: "ZONE-RANGE-01",
      entityType: "zone",
      overlayType: "search-radius",
      operationalState: "active",
      priority: "medium",
      labelPrimary: "Search Radius Alpha",
      regionCode: "SECTOR-ROME-01",
    },
    { steps: 72 }
  );

  const incident: GeoJSONFeature = {
    type: "Feature",
    id: "INC-001",
    geometry: {
      type: "Point",
      coordinates: [12.52, 41.91],
    },
    properties: {
      id: "INC-001",
      entityType: "incident",
      operationalState: "alert",
      priority: "high",
      confidence: "medium",
      freshness: "recent",
      sourceClass: "sensor_ingest",
      labelPrimary: "Checkpoint Delta Event",
      regionCode: "SECTOR-ROME-01",
      evidenceRefs: ["IMG-044", "SRC-201"],
    },
  };

  const route: GeoJSONFeature = {
    type: "Feature",
    id: "RTE-003",
    geometry: {
      type: "LineString",
      coordinates: [
        [12.44, 41.84],
        [12.47, 41.86],
        [12.50, 41.90],
        [12.54, 41.92],
      ],
    },
    properties: {
      id: "RTE-003",
      entityType: "route",
      operationalState: "active",
      priority: "medium",
      confidence: "high",
      freshness: "recent",
      sourceClass: "derived_analysis",
      labelPrimary: "Corridor Ember 3",
      regionCode: "SECTOR-ROME-01",
    },
  };

  return {
    type: "FeatureCollection",
    features: [rangeZone, incident, route],
  };
}
