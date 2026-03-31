import { T } from "./config";
import type {
  BBox,
  BBoxModel,
  ExtentMode,
  Feature,
  Geometry,
  GeometryColorRole,
  GeometryDiagnostics,
  GeometryProjection,
  GeometryScene,
  IntegrityCategory,
  IntegrityScore,
  IntegrityViolation,
  LabelModel,
  LabelOffsetToken,
  NodeModel,
  OperationalState,
  OverlayModel,
  PointFeature,
  Position,
  RenderLabelModel,
  RenderNodeModel,
  RenderOverlayModel,
  RenderRingModel,
  RenderVectorModel,
  RingModel,
  SurfaceRenderScene,
  VectorModel,
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

function surfaceIncludes(surfaces: GeometryScene["nodes"][number]["surfaces"], mode: WorkspaceMode) {
  return surfaces === "all" || surfaces.includes(mode);
}

function roleColor(role: GeometryColorRole) {
  switch (role) {
    case "active":
      return T.activeAmber;
    case "reference":
      return T.referenceBlue;
    default:
      return T.neutralMuted;
  }
}

type CanonicalScene = Omit<GeometryScene, "surfaces" | "diagnostics"> & { diagnostics?: GeometryDiagnostics };

function offsetValue(token: LabelOffsetToken) {
  switch (token) {
    case "xs":
      return 0.35;
    case "sm":
      return 0.6;
    case "md":
      return 0.95;
    case "lg":
      return 1.3;
    default:
      return 0.6;
  }
}

function scoreStatus(score: number): IntegrityScore["status"] {
  if (score >= 98) return "instrument-grade";
  if (score >= 95) return "production-ready";
  if (score >= 90) return "high quality but not locked";
  return "needs correction";
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
  return {
    x: 8 + flat.x * 0.86 + (50 - flat.y) * 0.14,
    y: 22 + flat.y * 0.56,
  };
}

function projectPosition(position: Position, bbox: BBox, projection: GeometryProjection) {
  return projection === "flat" ? projectPoint(position, bbox) : projectOblique(position, bbox);
}

function unprojectPoint(point: { x: number; y: number }, bbox: BBox): Position {
  const width = bbox[2] - bbox[0] || 1;
  const height = bbox[3] - bbox[1] || 1;
  return [bbox[0] + (point.x / 100) * width, bbox[1] + ((100 - point.y) / 100) * height];
}

export function bearingBetween(a: Position, b: Position) {
  const phi1 = toRadians(a[1]);
  const phi2 = toRadians(b[1]);
  const deltaLambda = toRadians(b[0] - a[0]);
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function midpoint(a: Position, b: Position): Position {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function resolveRingOpacity(index: number, count: number) {
  if (count <= 1) return 0.8;
  const step = (0.8 - 0.25) / (count - 1);
  return Number((0.8 - step * index).toFixed(3));
}

function projectRing(center: Position, radiusMeters: number, bbox: BBox, projection: GeometryProjection) {
  const projectedCenter = projectPosition(center, bbox, projection);
  const eastPoint = projectPosition(destinationPoint(center, 90, radiusMeters), bbox, projection);
  const northPoint = projectPosition(destinationPoint(center, 0, radiusMeters), bbox, projection);
  return {
    cx: projectedCenter.x,
    cy: projectedCenter.y,
    rx: Math.abs(eastPoint.x - projectedCenter.x),
    ry: Math.abs(projectedCenter.y - northPoint.y),
  };
}

function projectPath(points: Position[], bbox: BBox, projection: GeometryProjection, closed: boolean) {
  const projector = projection === "flat" ? projectPoint : projectOblique;
  const path = points
    .map((point, index) => {
      const projected = projector(point, bbox);
      return `${index === 0 ? "M" : "L"}${projected.x},${projected.y}`;
    })
    .join(" ");
  return closed ? `${path} Z` : path;
}

function featureAnchor(feature: Feature): Position {
  if (feature.geometry.type === "Point") return feature.geometry.coordinates;
  if (feature.geometry.type === "LineString") return feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)];
  return feature.geometry.coordinates[0][0];
}

function intersectRayWithBBox(origin: Position, target: Position, bbox: BBox): Position {
  const start = projectPoint(origin, bbox);
  const end = projectPoint(target, bbox);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const candidates: number[] = [];

  if (dx !== 0) {
    const tLeft = (0 - start.x) / dx;
    const yLeft = start.y + dy * tLeft;
    if (tLeft > 0 && yLeft >= 0 && yLeft <= 100) candidates.push(tLeft);

    const tRight = (100 - start.x) / dx;
    const yRight = start.y + dy * tRight;
    if (tRight > 0 && yRight >= 0 && yRight <= 100) candidates.push(tRight);
  }

  if (dy !== 0) {
    const tTop = (0 - start.y) / dy;
    const xTop = start.x + dx * tTop;
    if (tTop > 0 && xTop >= 0 && xTop <= 100) candidates.push(tTop);

    const tBottom = (100 - start.y) / dy;
    const xBottom = start.x + dx * tBottom;
    if (tBottom > 0 && xBottom >= 0 && xBottom <= 100) candidates.push(tBottom);
  }

  const t = Math.min(...candidates.filter((value) => Number.isFinite(value)));
  if (!Number.isFinite(t)) return target;

  return unprojectPoint({ x: start.x + dx * t, y: start.y + dy * t }, bbox);
}

function toBBoxModel(coordinates: BBox, source: ExtentMode): BBoxModel {
  return { coordinates, source };
}

function comparedSet(comparedIds: string[]) {
  return new Set(comparedIds);
}

function createNodeModels(selectedFeature: Feature, visibleFeatures: Feature[], comparedIds: string[]): NodeModel[] {
  const compared = comparedSet(comparedIds);
  const nodes = visibleFeatures
    .filter((feature) => feature.geometry.type === "Point")
    .map<NodeModel>((feature) => {
      const pointFeature = feature as PointFeature;
      const selected = feature.properties.id === selectedFeature.properties.id;
      const semanticRole = feature.properties.entityType === "incident" ? "incident" : feature.properties.entityType === "site" ? "site" : "reference";
      return {
        id: `node-${feature.properties.id}`,
        featureId: feature.properties.id,
        label: feature.properties.labelPrimary,
        position: pointFeature.geometry.coordinates,
        semanticRole,
        surfaces: "all",
        visual: {
          shape: feature.properties.entityType === "incident" ? "incident" : feature.properties.entityType === "site" ? "asset" : "reference",
          sizePx: selected ? 18 : 14,
          fillRole: selected || feature.properties.operationalState === "active" ? "active" : feature.properties.entityType === "site" ? "reference" : "neutral",
          strokeRole: selected ? "active" : "reference",
          haloRole: selected ? "active" : compared.has(feature.properties.id) ? "reference" : undefined,
        },
      };
    });

  if (selectedFeature.geometry.type !== "Point") {
    nodes.push({
      id: `node-selection-${selectedFeature.properties.id}`,
      featureId: selectedFeature.properties.id,
      label: selectedFeature.properties.labelPrimary,
      position: featureAnchor(selectedFeature),
      semanticRole: "selection-anchor",
      surfaces: "all",
      visual: {
        shape: "reference",
        sizePx: 12,
        fillRole: "active",
        strokeRole: "active",
        haloRole: "active",
      },
    });
  }

  return nodes;
}

function createRingModels(center: Position): RingModel[] {
  const surfacesByIndex: WorkspaceMode[][] = [
    ["flat-map", "site-3d", "theater-3d", "ops-wall"],
    ["site-3d", "theater-3d", "ops-wall"],
    ["theater-3d", "ops-wall"],
    ["theater-3d", "ops-wall"],
    ["theater-3d", "ops-wall"],
  ];

  return Array.from({ length: 5 }, (_, index) => ({
    id: `ring-${index + 1}`,
    anchorId: "selection-anchor",
    center,
    radiusMeters: (index + 1) * 32000,
    index,
    baseStepKm: 32,
    spacingMode: "fixed-step",
    surfaces: surfacesByIndex[index],
    visual: {
      colorRole: index < 2 ? "reference" : "active",
      strokeWidthPx: index === 0 ? 1.5 : 1,
      opacity: resolveRingOpacity(index, 5),
    },
  }));
}

function createVectorModels(selectedFeature: Feature, visibleFeatures: Feature[], bbox: BBox): VectorModel[] {
  const center = featureAnchor(selectedFeature);
  const incident = visibleFeatures.find((feature) => feature.properties.entityType === "incident") ?? selectedFeature;
  const route = visibleFeatures.find((feature) => feature.properties.entityType === "route") ?? selectedFeature;
  const site = visibleFeatures.find((feature) => feature.properties.entityType === "site") ?? selectedFeature;

  const incidentBearing = bearingBetween(center, featureAnchor(incident));
  const routeBearing = bearingBetween(center, featureAnchor(route));
  const siteBearing = bearingBetween(center, featureAnchor(site));

  const ringTwo = destinationPoint(center, incidentBearing, 64000);
  const ringFour = destinationPoint(center, siteBearing, 128000);
  const bboxEdge = intersectRayWithBBox(center, featureAnchor(route), bbox);

  return [
    {
      id: "vector-route-lock",
      label: "Route Lock",
      semanticRole: "active-route-lock",
      startAnchorId: `anchor-${selectedFeature.properties.id}`,
      endAnchorId: "anchor-ring-two",
      start: center,
      end: ringTwo,
      surfaces: ["eo-overlay", "theater-3d", "ops-wall"],
      visual: {
        colorRole: "active",
        strokeWidthPx: 2,
        opacity: 0.92,
        haloRole: "active",
      },
    },
    {
      id: "vector-reference-route",
      label: "Reference Route",
      semanticRole: "reference-route",
      startAnchorId: "anchor-ring-two",
      endAnchorId: "anchor-bbox-route",
      start: ringTwo,
      end: bboxEdge,
      surfaces: ["eo-overlay", "theater-3d", "ops-wall"],
      visual: {
        colorRole: "reference",
        strokeWidthPx: 2,
        opacity: 0.92,
      },
    },
    {
      id: "vector-patrol-arc",
      label: "Patrol Arc",
      semanticRole: "secondary-patrol-arc",
      startAnchorId: `anchor-${incident.properties.id}`,
      endAnchorId: "anchor-ring-four",
      start: featureAnchor(incident),
      end: ringFour,
      surfaces: ["eo-overlay", "theater-3d", "ops-wall"],
      visual: {
        colorRole: "neutral",
        strokeWidthPx: 1,
        opacity: 0.72,
        dashArray: "2 2",
      },
    },
    {
      id: "vector-route-bearing",
      label: "Route Bearing",
      semanticRole: "site-bearing",
      startAnchorId: `anchor-${selectedFeature.properties.id}`,
      endAnchorId: "anchor-route-bearing",
      start: center,
      end: destinationPoint(center, routeBearing, 18000),
      surfaces: ["site-3d"],
      visual: {
        colorRole: "reference",
        strokeWidthPx: 1,
        opacity: 0.66,
      },
    },
  ];
}

function createLabelModels(selectedFeature: Feature, vectors: VectorModel[]): LabelModel[] {
  const center = featureAnchor(selectedFeature);
  const vectorRouteLock = vectors.find((vector) => vector.id === "vector-route-lock")!;
  const vectorReference = vectors.find((vector) => vector.id === "vector-reference-route")!;
  const siteMarkerSpecs = [
    { id: "label-ingress", text: "Ingress", bearing: 210, distance: 12000 },
    { id: "label-stack", text: "Stack", bearing: 300, distance: 9000 },
    { id: "label-perimeter", text: "Perimeter", bearing: 35, distance: 11000 },
    { id: "label-egress", text: "Egress", bearing: 120, distance: 14000 },
  ] as const;

  return [
    {
      id: "label-selection",
      text: selectedFeature.properties.labelPrimary.toUpperCase(),
      anchorId: `anchor-${selectedFeature.properties.id}`,
      anchorPosition: center,
      anchorKind: "node-center",
      semanticRole: "selection-label",
      surfaces: "all",
      visual: {
        hierarchy: "primary",
        offsetToken: "lg",
        colorRole: "active",
        rotationDegrees: 0,
      },
    },
    {
      id: "label-step",
      text: "32km STEP",
      anchorId: "ring-1",
      anchorPosition: destinationPoint(center, 90, 32000),
      anchorKind: "ring-tangent",
      semanticRole: "scale-proof",
      surfaces: ["theater-3d", "ops-wall"],
      visual: {
        hierarchy: "measurement",
        offsetToken: "md",
        colorRole: "reference",
        rotationDegrees: 0,
      },
    },
    {
      id: "label-route-lock",
      text: "ROUTE LOCK",
      anchorId: vectorRouteLock.id,
      anchorPosition: midpoint(vectorRouteLock.start, vectorRouteLock.end),
      anchorKind: "vector-midpoint",
      semanticRole: "vector-label",
      surfaces: ["eo-overlay", "theater-3d", "ops-wall"],
      visual: {
        hierarchy: "primary",
        offsetToken: "sm",
        colorRole: "active",
        rotationDegrees: 0,
      },
    },
    {
      id: "label-mission-arc",
      text: "MISSION ARC",
      anchorId: vectorReference.id,
      anchorPosition: midpoint(vectorReference.start, vectorReference.end),
      anchorKind: "vector-midpoint",
      semanticRole: "vector-label",
      surfaces: ["theater-3d", "ops-wall"],
      visual: {
        hierarchy: "secondary",
        offsetToken: "sm",
        colorRole: "reference",
        rotationDegrees: 0,
      },
    },
    ...siteMarkerSpecs.map<LabelModel>((spec) => ({
      id: spec.id,
      text: spec.text,
      anchorId: spec.id,
      anchorPosition: destinationPoint(center, spec.bearing, spec.distance),
      anchorKind: "node-center",
      semanticRole: "site-marker",
      surfaces: ["site-3d"],
      visual: {
        hierarchy: "secondary",
        offsetToken: "sm",
        colorRole: "reference",
        rotationDegrees: 0,
      },
    })),
  ];
}

function createOverlayModels(selectedFeature: Feature, visibleFeatures: Feature[], comparedIds: string[]): OverlayModel[] {
  const selectedId = selectedFeature.properties.id;
  const center = featureAnchor(selectedFeature);
  const compared = comparedSet(comparedIds);

  const featurePaths = visibleFeatures
    .filter((feature) => feature.geometry.type !== "Point")
    .flatMap<OverlayModel>((feature) => {
      const selected = feature.properties.id === selectedId;
      const geometry = feature.geometry;
      if (geometry.type === "Point") {
        return [];
      }
      const closed = geometry.type === "Polygon";
      const points: Position[] = geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates;
      const lineGeometry = geometry.type === "LineString";
      const colorRole = selected ? "active" : lineGeometry ? "reference" : "neutral";
      const baseVisual = {
        colorRole,
        strokeWidthPx: selected ? (lineGeometry ? 2 : 1) : lineGeometry ? 1 : 0.6,
        opacity: closed ? 0.88 : 1,
        fill: closed ? (selected ? "rgba(255, 200, 87, 0.18)" : "rgba(240, 236, 227, 0.08)") : undefined,
        dashArray: lineGeometry && feature.properties.entityType !== "route" ? "1.2 1.2" : undefined,
        haloRole: compared.has(feature.properties.id) ? "reference" : selected ? "active" : undefined,
      } as const;

      const overlays: OverlayModel[] = [
        {
          id: `overlay-feature-${feature.properties.id}-flat`,
          type: "feature-path",
          featureId: feature.properties.id,
          semanticRole: `feature-${feature.properties.entityType}`,
          surfaces: ["flat-map"],
          projection: "flat",
          points,
          closed,
          visual: baseVisual,
        },
      ];

      if (closed) {
        overlays.push({
          id: `overlay-feature-${feature.properties.id}-oblique`,
          type: "feature-path",
          featureId: feature.properties.id,
          semanticRole: `feature-${feature.properties.entityType}`,
          surfaces: ["site-3d"],
          projection: "oblique",
          points,
          closed,
          visual: baseVisual,
        });
      } else {
        overlays.push({
          id: `overlay-feature-${feature.properties.id}-oblique`,
          type: "feature-path",
          featureId: feature.properties.id,
          semanticRole: `feature-${feature.properties.entityType}`,
          surfaces: ["site-3d", "theater-3d"],
          projection: "oblique",
          points,
          closed,
          visual: baseVisual,
        });
      }

      return overlays;
    });

  const eoBoxes = [
    [44, 46, 13, 7, "active"],
    [45, 56, 13, 7, "active"],
    [45, 66, 12, 7, "active"],
    [38, 81, 18, 8, "active"],
    [39, 63, 15, 12, "reference"],
    [52, 60, 17, 14, "reference"],
    [68, 20, 11, 5, "reference"],
  ] as const satisfies readonly (readonly [number, number, number, number, GeometryColorRole])[];

  const eoBoxOverlays: OverlayModel[] = eoBoxes.map(([x, y, width, height, colorRole], index) => ({
    id: `overlay-eo-box-${index}`,
    type: "screen-box",
    semanticRole: "eo-target-box",
    surfaces: ["eo-overlay"],
    projection: "screen",
    frame: { x, y, width, height },
    visual: {
      colorRole,
      borderWidthPx: 1,
      glowRole: colorRole,
    },
  }));

  return [
    ...featurePaths,
    {
      id: "overlay-flat-crosshair",
      type: "crosshair",
      semanticRole: "selection-crosshair",
      surfaces: ["flat-map"],
      projection: "flat",
      anchorId: `anchor-${selectedId}`,
      anchorPosition: center,
      visual: {
        colorRole: "reference",
        size: 4,
        strokeWidthPx: 1,
        opacity: 0.6,
      },
    },
    {
      id: "overlay-eo-selection",
      type: "ellipse",
      semanticRole: "eo-selection-ring",
      surfaces: ["eo-overlay"],
      projection: "flat",
      anchorId: `anchor-${selectedId}`,
      anchorPosition: center,
      width: 200,
      height: 200,
      visual: {
        colorRole: "reference",
        opacity: 0.4,
        borderWidthPx: 1,
        borderStyle: "solid",
      },
    },
    ...eoBoxOverlays,
  ];
}

function resolveLabelRotation(label: LabelModel, vectors: VectorModel[]) {
  if (label.anchorKind !== "vector-midpoint") return label.visual.rotationDegrees;
  const vector = vectors.find((candidate) => candidate.id === label.anchorId);
  if (!vector) return label.visual.rotationDegrees;
  const dx = vector.end[0] - vector.start[0];
  const dy = vector.end[1] - vector.start[1];
  return Math.atan2(-dy, dx) * (180 / Math.PI);
}

function resolveLabelPosition(label: LabelModel, bbox: BBox, projection: GeometryProjection, vectors: VectorModel[]) {
  const anchor = projectPosition(label.anchorPosition, bbox, projection);
  const offset = offsetValue(label.visual.offsetToken);
  const rotationDegrees = resolveLabelRotation(label, vectors);
  switch (label.anchorKind) {
    case "node-center":
      return { x: anchor.x, y: anchor.y - offset, anchorX: anchor.x, anchorY: anchor.y, rotationDegrees };
    case "vector-midpoint":
      return { x: anchor.x + offset * 0.7, y: anchor.y - offset, anchorX: anchor.x, anchorY: anchor.y, rotationDegrees };
    case "ring-tangent":
      return { x: anchor.x + offset, y: anchor.y - offset * 0.5, anchorX: anchor.x, anchorY: anchor.y, rotationDegrees };
    default:
      return { x: anchor.x, y: anchor.y, anchorX: anchor.x, anchorY: anchor.y, rotationDegrees };
  }
}

function renderNodes(nodes: NodeModel[], bbox: BBox, projection: GeometryProjection): RenderNodeModel[] {
  return nodes.map((node) => {
    const projected = projectPosition(node.position, bbox, projection);
    return {
      id: node.id,
      label: node.label,
      x: projected.x,
      y: projected.y,
      shape: node.visual.shape,
      sizePx: node.visual.sizePx,
      fill: roleColor(node.visual.fillRole),
      stroke: roleColor(node.visual.strokeRole),
      halo: node.visual.haloRole ? (node.visual.haloRole === "active" ? "var(--geometry-selection-glow)" : "var(--geometry-reference-glow)") : undefined,
      featureId: node.featureId,
    };
  });
}

function renderRings(rings: RingModel[], bbox: BBox, projection: GeometryProjection): RenderRingModel[] {
  return rings.map((ring) => {
    const projected = projectRing(ring.center, ring.radiusMeters, bbox, projection);
    return {
      id: ring.id,
      cx: projected.cx,
      cy: projected.cy,
      rx: projected.rx,
      ry: projected.ry,
      stroke: roleColor(ring.visual.colorRole),
      strokeWidth: ring.visual.strokeWidthPx,
      opacity: ring.visual.opacity,
      radiusMeters: ring.radiusMeters,
      index: ring.index,
    };
  });
}

function renderVectors(vectors: VectorModel[], bbox: BBox, projection: GeometryProjection): RenderVectorModel[] {
  return vectors.map((vector) => {
    const start = projectPosition(vector.start, bbox, projection);
    const end = projectPosition(vector.end, bbox, projection);
    return {
      id: vector.id,
      path: `M${start.x},${start.y} L${end.x},${end.y}`,
      stroke: roleColor(vector.visual.colorRole),
      strokeWidth: vector.visual.strokeWidthPx,
      opacity: vector.visual.opacity,
      dashArray: vector.visual.dashArray,
      halo: vector.visual.haloRole ? "var(--geometry-selection-glow)" : undefined,
      start,
      end,
    };
  });
}

function renderLabels(labels: LabelModel[], bbox: BBox, projection: GeometryProjection, vectors: VectorModel[]): RenderLabelModel[] {
  return labels.map((label) => {
    const projected = resolveLabelPosition(label, bbox, projection, vectors);
    return {
      id: label.id,
      text: label.text,
      x: projected.x,
      y: projected.y,
      anchorX: projected.anchorX,
      anchorY: projected.anchorY,
      color: roleColor(label.visual.colorRole),
      rotationDegrees: projected.rotationDegrees,
      hierarchy: label.visual.hierarchy,
    };
  });
}

function renderOverlays(overlays: OverlayModel[], bbox: BBox): RenderOverlayModel[] {
  return overlays.map((overlay) => {
    switch (overlay.type) {
      case "feature-path":
        return {
          id: overlay.id,
          type: "feature-path",
          path: projectPath(overlay.points, bbox, overlay.projection, overlay.closed),
          stroke: roleColor(overlay.visual.colorRole),
          strokeWidth: overlay.visual.strokeWidthPx,
          opacity: overlay.visual.opacity,
          fill: overlay.visual.fill,
          dashArray: overlay.visual.dashArray,
          halo: overlay.visual.haloRole ? (overlay.visual.haloRole === "active" ? "var(--geometry-selection-glow)" : "var(--geometry-reference-glow)") : undefined,
        };
      case "screen-box":
        return {
          id: overlay.id,
          type: "screen-box",
          x: overlay.frame.x,
          y: overlay.frame.y,
          width: overlay.frame.width,
          height: overlay.frame.height,
          borderColor: roleColor(overlay.visual.colorRole),
          borderWidth: overlay.visual.borderWidthPx,
          glow: overlay.visual.glowRole ? (overlay.visual.glowRole === "active" ? "var(--geometry-selection-glow)" : "var(--geometry-reference-glow)") : undefined,
        };
      case "crosshair": {
        const projected = projectPosition(overlay.anchorPosition, bbox, overlay.projection);
        return {
          id: overlay.id,
          type: "crosshair",
          x: projected.x,
          y: projected.y,
          size: overlay.visual.size,
          stroke: roleColor(overlay.visual.colorRole),
          strokeWidth: overlay.visual.strokeWidthPx,
          opacity: overlay.visual.opacity,
        };
      }
      case "marker": {
        const projected = projectPosition(overlay.anchorPosition, bbox, overlay.projection);
        return {
          id: overlay.id,
          type: "marker",
          x: projected.x,
          y: projected.y,
          text: overlay.text,
          color: roleColor(overlay.visual.colorRole),
          stemColor: roleColor(overlay.visual.colorRole),
        };
      }
      case "ellipse": {
        const projected = projectPosition(overlay.anchorPosition, bbox, overlay.projection === "screen" ? "flat" : overlay.projection);
        return {
          id: overlay.id,
          type: "ellipse",
          x: projected.x,
          y: projected.y,
          width: overlay.width,
          height: overlay.height,
          borderColor: roleColor(overlay.visual.colorRole),
          borderWidth: overlay.visual.borderWidthPx,
          borderStyle: overlay.visual.borderStyle,
          opacity: overlay.visual.opacity,
          fill: overlay.visual.fill,
          blurPx: overlay.blurPx,
          transform: overlay.transform,
        };
      }
      default:
        return overlay satisfies never;
    }
  });
}

function buildSurfaceScene(mode: WorkspaceMode, scene: CanonicalScene & { diagnostics: GeometryDiagnostics }): SurfaceRenderScene {
  const projection: GeometryProjection = mode === "flat-map" || mode === "eo-overlay" ? "flat" : "oblique";
  const bbox = scene.bbox.coordinates;
  const nodes = renderNodes(scene.nodes.filter((node) => surfaceIncludes(node.surfaces, mode)), bbox, projection);
  const rings = renderRings(scene.rings.filter((ring) => surfaceIncludes(ring.surfaces, mode)), bbox, projection);
  const vectors = renderVectors(scene.vectors.filter((vector) => surfaceIncludes(vector.surfaces, mode)), bbox, projection);
  const labels = renderLabels(scene.labels.filter((label) => surfaceIncludes(label.surfaces, mode)), bbox, projection, scene.vectors);
  const overlays = renderOverlays(scene.overlays.filter((overlay) => surfaceIncludes(overlay.surfaces, mode)), bbox);
  return {
    nodes,
    rings,
    vectors,
    labels,
    overlays,
    bbox: scene.bbox,
    diagnostics: scene.diagnostics,
  };
}

function computeDiagnostics(scene: CanonicalScene): GeometryDiagnostics {
  const violations: IntegrityViolation[] = [];

  const ringFormulaValid = scene.rings.every((ring, index) =>
    index === 0 ? ring.radiusMeters === ring.baseStepKm * 1000 : ring.radiusMeters - scene.rings[index - 1].radiusMeters === ring.baseStepKm * 1000
  );
  if (!ringFormulaValid) {
    violations.push({ category: "rings", type: "ring_formula_invalid", objectId: "rings", reason: "Ring spacing does not follow the canonical fixed-step formula." });
  }

  const vectorAnchorsValid = scene.vectors.every((vector) => Boolean(vector.startAnchorId) && Boolean(vector.endAnchorId));
  if (!vectorAnchorsValid) {
    violations.push({ category: "anchors", type: "vector_anchor_missing", objectId: "vectors", reason: "A vector is missing a required anchor id." });
  }

  const labelAnchorsValid = scene.labels.every((label) => Boolean(label.anchorId) && Boolean(label.anchorPosition) && Boolean(label.visual.offsetToken));
  if (!labelAnchorsValid) {
    violations.push({ category: "labels", type: "label_anchor_missing", objectId: "labels", reason: "A label is missing anchor ownership or an offset token." });
  }

  const bboxValid = Boolean(scene.bbox.coordinates) && Boolean(scene.bbox.source);
  if (!bboxValid) {
    violations.push({ category: "bbox", type: "bbox_missing", objectId: "bbox", reason: "The scene bbox is missing coordinates or source metadata." });
  }

  const geometryOutsideScene = scene.overlays.some((overlay) => overlay.type === "screen-box" && overlay.semanticRole === "");
  if (geometryOutsideScene) {
    violations.push({ category: "scale", type: "geometry_outside_scene", objectId: "overlays", reason: "A rendered overlay exists without canonical scene ownership." });
  }

  const colorSemanticsValid = scene.vectors.every((vector) =>
    (vector.visual.colorRole === "reference" && !vector.visual.haloRole) ||
    vector.visual.colorRole === "active" ||
    vector.visual.colorRole === "neutral"
  );
  if (!colorSemanticsValid) {
    violations.push({ category: "color", type: "color_semantic_invalid", objectId: "vectors", reason: "A vector color role violates the semantic color contract." });
  }

  const breakdown: Record<IntegrityCategory, number> = {
    anchors: vectorAnchorsValid ? 16 : 8,
    rings: ringFormulaValid ? 16 : 8,
    vectors: vectorAnchorsValid ? 16 : 8,
    labels: labelAnchorsValid ? 12 : 6,
    color: colorSemanticsValid ? 12 : 6,
    scale: ringFormulaValid ? 12 : 6,
    bbox: bboxValid ? 12 : 0,
    depth: 8,
  };
  const overall = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  return {
    integrityScore: {
      overall,
      status: scoreStatus(overall),
      breakdown,
    },
    violations,
  };
}

export function buildGeometryScene(params: {
  selectedFeature: Feature;
  visibleFeatures: Feature[];
  comparedIds: string[];
  bbox: BBox;
  bboxSource: ExtentMode;
}): GeometryScene {
  const { selectedFeature, visibleFeatures, comparedIds, bbox, bboxSource } = params;
  const center = featureAnchor(selectedFeature);
  const nodes = createNodeModels(selectedFeature, visibleFeatures, comparedIds);
  const rings = createRingModels(center);
  const vectors = createVectorModels(selectedFeature, visibleFeatures, bbox);
  const labels = createLabelModels(selectedFeature, vectors);
  const overlays = createOverlayModels(selectedFeature, visibleFeatures, comparedIds);
  const baseScene = {
    nodes,
    rings,
    vectors,
    labels,
    overlays,
    bbox: toBBoxModel(bbox, bboxSource),
  };
  const diagnostics = computeDiagnostics(baseScene);
  const sceneWithoutSurfaces = { ...baseScene, diagnostics };

  return {
    ...sceneWithoutSurfaces,
    surfaces: {
      "flat-map": buildSurfaceScene("flat-map", sceneWithoutSurfaces),
      "eo-overlay": buildSurfaceScene("eo-overlay", sceneWithoutSurfaces),
      "site-3d": buildSurfaceScene("site-3d", sceneWithoutSurfaces),
      "theater-3d": buildSurfaceScene("theater-3d", sceneWithoutSurfaces),
      "ops-wall": buildSurfaceScene("ops-wall", sceneWithoutSurfaces),
    },
  };
}

export function entityLayer(entityType: Feature["properties"]["entityType"]) {
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
      return "border-accent-alert/70 bg-accent-alert/70 text-zinc-900";
    case "selected":
      return "border-geometry-active/70 bg-geometry-active/70 text-zinc-900";
    case "active":
      return "border-accent-verified/70 bg-accent-verified/70 text-zinc-900";
    case "stale":
      return "border-geometry-reference/70 bg-geometry-reference/65 text-zinc-900";
    default:
      return "border-zinc-700 bg-zinc-200/70 text-zinc-900";
  }
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

export function integritySummary(score: GeometryDiagnostics["integrityScore"]) {
  return `${score.overall}% · ${score.status}`;
}

export function surfaceCardTone(config: { backgroundVar: string; gridVisible: boolean }) {
  return {
    background: config.backgroundVar,
    gridVisible: config.gridVisible,
  };
}
