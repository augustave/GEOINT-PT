export type Position = [number, number];
export type BBox = [number, number, number, number];
export type EntityType = "incident" | "route" | "zone" | "site";
export type Priority = "low" | "medium" | "high" | "critical";
export type Confidence = "low" | "medium" | "high" | "confirmed";
export type Freshness = "recent" | "aging" | "stale";
export type OperationalState = "default" | "active" | "selected" | "alert" | "stale";
export type WorkspaceMode = "flat-map" | "eo-overlay" | "site-3d" | "theater-3d" | "ops-wall";
export type ExtentMode = "operational" | "selection" | "compare";

export type Geometry =
  | { type: "Point"; coordinates: Position }
  | { type: "LineString"; coordinates: Position[] }
  | { type: "Polygon"; coordinates: Position[][] };

export interface FeatureProperties {
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

export interface Feature {
  type: "Feature";
  geometry: Geometry;
  properties: FeatureProperties;
}

export type PointFeature = Feature & { geometry: { type: "Point"; coordinates: Position } };

export interface WorkspaceState {
  selectedId: string;
  query: string;
  comparedIds: string[];
  visibleLayers: Record<string, boolean>;
  extentMode: ExtentMode;
  workspaceMode: WorkspaceMode;
}

export interface ScreenFamilySpec {
  id: WorkspaceMode;
  name: string;
  shortName: string;
  role: string;
  question: string;
  view: string;
  geometryBehavior: string;
  selectionPersistence: "strong";
  compareRole: "strong" | "medium" | "summary";
  behaviorSummary: string;
}

export interface SurfaceViewProps {
  features: Feature[];
  visibleFeatures: Feature[];
  comparedIds: string[];
  selectedFeature: Feature;
  activeBBox: BBox;
  selectionAnchor: Position;
  selectionProjection: { x: number; y: number };
  selectionOblique: { x: number; y: number };
  incidentFeatures: PointFeature[];
  ringSizes: number[];
  extentMode: ExtentMode;
  setSelectedId: (id: string) => void;
}
