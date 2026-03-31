export type Position = [number, number];
export type BBox = [number, number, number, number];
export type EntityType = "incident" | "route" | "zone" | "site";
export type Priority = "low" | "medium" | "high" | "critical";
export type Confidence = "low" | "medium" | "high" | "confirmed";
export type Freshness = "recent" | "aging" | "stale";
export type OperationalState = "default" | "active" | "selected" | "alert" | "stale";
export type WorkspaceMode = "flat-map" | "eo-overlay" | "site-3d" | "theater-3d" | "ops-wall";
export type ExtentMode = "operational" | "selection" | "compare";
export type ShellTemplate = "map" | "scene" | "ops-wall";
export type DetailMode = "persistent-dossier" | "floating-intel-card" | "contextual-modules";
export type TopBarVariant = "map-scope" | "tasking" | "command-wall";
export type ToolRailVariant = "full-index" | "thin-instruments" | "wall-modules";
export type SceneDominance = "medium" | "high" | "maximum";
export type SurfaceLighting = "neutral" | "cold" | "spot" | "radial" | "flat";
export type CameraStyle = "orthographic" | "top-down-tilt" | "fixed-oblique" | "elevated-orbital";
export type AnnotationDensity = "low" | "medium" | "high";
export type RingSpacingMode = "fixed-step" | "exponential";
export type GeometryProjection = "flat" | "oblique";
export type GeometryColorRole = "reference" | "active" | "neutral";
export type VectorStrokeRole = "primary" | "secondary" | "dashed";
export type NodeShape = "incident" | "asset" | "reference";
export type LabelTone = "primary" | "secondary" | "measurement";
export type LabelOffsetToken = "xs" | "sm" | "md" | "lg";
export type VectorAnchorKind = "node" | "ring-intersection" | "bbox-edge";
export type LabelAnchorKind = "node-center" | "vector-midpoint" | "ring-tangent";
export type IntegrityCategory = "anchors" | "rings" | "vectors" | "labels" | "color" | "scale" | "bbox" | "depth";
export type SurfaceSelector = "all" | WorkspaceMode[];
export type OverlayType = "feature-path" | "screen-box" | "crosshair" | "marker" | "ellipse";
export type OverlayProjection = GeometryProjection | "screen";
export type TaskType = "review" | "verify" | "monitor" | "compare" | "annotate" | "escalate" | "handoff" | "watch";
export type TaskStatus = "draft" | "queued" | "active" | "blocked" | "under_review" | "verified" | "closed";
export type MissionStage = "detect" | "assess" | "assign" | "act" | "verify";

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
  shellTemplate: ShellTemplate;
  detailMode: DetailMode;
  topBarVariant: TopBarVariant;
  toolRailVariant: ToolRailVariant;
  sceneDominance: SceneDominance;
}

export interface SurfaceConfig {
  mode: WorkspaceMode;
  lighting: SurfaceLighting;
  camera: CameraStyle;
  gridVisible: boolean;
  groundPlaneVisible: boolean;
  annotationDensity: AnnotationDensity;
  overlays: string[];
  backgroundVar: string;
}

export interface TaskModel {
  id: string;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  assignee: string | null;
  created_at: string;
  updated_at: string;
  source_object_id: string;
  bbox_snapshot: BBoxModel;
  surface_origin: WorkspaceMode;
  notes: string;
  evidence_ids: string[];
  compare_ids: string[];
  time_window?: string | null;
}

export interface MissionThreadModel {
  id: string;
  object_id: string;
  task_ids: string[];
  current_stage: MissionStage;
}

export interface CreateTaskInput {
  type: TaskType;
  assignee?: string | null;
  time_window?: string | null;
  notes: string;
  evidence_ids: string[];
  compare_ids: string[];
}

export interface BBoxModel {
  coordinates: BBox;
  source: ExtentMode;
}

export interface NodeVisualModel {
  shape: NodeShape;
  sizePx: number;
  fillRole: GeometryColorRole;
  strokeRole: GeometryColorRole;
  haloRole?: GeometryColorRole;
}

export interface NodeModel {
  id: string;
  featureId?: string;
  label: string;
  position: Position;
  semanticRole: string;
  surfaces: SurfaceSelector;
  visual: NodeVisualModel;
}

export interface RingVisualModel {
  colorRole: GeometryColorRole;
  strokeWidthPx: number;
  opacity: number;
}

export interface RingModel {
  id: string;
  anchorId: string;
  center: Position;
  radiusMeters: number;
  index: number;
  baseStepKm: number;
  spacingMode: RingSpacingMode;
  surfaces: SurfaceSelector;
  visual: RingVisualModel;
}

export interface VectorVisualModel {
  colorRole: GeometryColorRole;
  strokeWidthPx: number;
  opacity: number;
  dashArray?: string;
  haloRole?: GeometryColorRole;
}

export interface VectorModel {
  id: string;
  label: string;
  semanticRole: string;
  startAnchorId: string;
  endAnchorId: string;
  start: Position;
  end: Position;
  surfaces: SurfaceSelector;
  visual: VectorVisualModel;
}

export interface LabelVisualModel {
  hierarchy: LabelTone;
  offsetToken: LabelOffsetToken;
  colorRole: GeometryColorRole;
  rotationDegrees: number;
}

export interface LabelModel {
  id: string;
  text: string;
  anchorId: string;
  anchorPosition: Position;
  anchorKind: LabelAnchorKind;
  semanticRole: string;
  surfaces: SurfaceSelector;
  visual: LabelVisualModel;
}

export interface FeaturePathOverlayModel {
  id: string;
  type: "feature-path";
  featureId?: string;
  semanticRole: string;
  surfaces: SurfaceSelector;
  projection: GeometryProjection;
  points: Position[];
  closed: boolean;
  visual: {
    colorRole: GeometryColorRole;
    strokeWidthPx: number;
    opacity: number;
    fill?: string;
    dashArray?: string;
    haloRole?: GeometryColorRole;
  };
}

export interface ScreenBoxOverlayModel {
  id: string;
  type: "screen-box";
  semanticRole: string;
  surfaces: SurfaceSelector;
  projection: "screen";
  frame: { x: number; y: number; width: number; height: number };
  visual: {
    colorRole: GeometryColorRole;
    borderWidthPx: number;
    glowRole?: GeometryColorRole;
  };
}

export interface CrosshairOverlayModel {
  id: string;
  type: "crosshair";
  semanticRole: string;
  surfaces: SurfaceSelector;
  projection: GeometryProjection;
  anchorId: string;
  anchorPosition: Position;
  visual: {
    colorRole: GeometryColorRole;
    size: number;
    strokeWidthPx: number;
    opacity: number;
  };
}

export interface MarkerOverlayModel {
  id: string;
  type: "marker";
  semanticRole: string;
  surfaces: SurfaceSelector;
  projection: GeometryProjection;
  anchorId: string;
  anchorPosition: Position;
  text: string;
  visual: {
    colorRole: GeometryColorRole;
    offsetToken: LabelOffsetToken;
  };
}

export interface EllipseOverlayModel {
  id: string;
  type: "ellipse";
  semanticRole: string;
  surfaces: SurfaceSelector;
  projection: GeometryProjection | "screen";
  anchorId: string;
  anchorPosition: Position;
  width: number;
  height: number;
  blurPx?: number;
  transform?: string;
  visual: {
    colorRole: GeometryColorRole;
    opacity: number;
    borderWidthPx: number;
    borderStyle: "solid" | "dashed";
    fill?: string;
  };
}

export type OverlayModel =
  | FeaturePathOverlayModel
  | ScreenBoxOverlayModel
  | CrosshairOverlayModel
  | MarkerOverlayModel
  | EllipseOverlayModel;

export interface IntegrityViolation {
  category: IntegrityCategory;
  type: string;
  objectId: string;
  reason: string;
}

export interface IntegrityScore {
  overall: number;
  status: "instrument-grade" | "production-ready" | "high quality but not locked" | "needs correction";
  breakdown: Record<IntegrityCategory, number>;
}

export interface GeometryDiagnostics {
  integrityScore: IntegrityScore;
  violations: IntegrityViolation[];
}

export interface RenderNodeModel {
  id: string;
  label: string;
  x: number;
  y: number;
  shape: NodeShape;
  sizePx: number;
  fill: string;
  stroke: string;
  halo?: string;
  featureId?: string;
}

export interface RenderRingModel {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  radiusMeters: number;
  index: number;
}

export interface RenderVectorModel {
  id: string;
  path: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  dashArray?: string;
  halo?: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export interface RenderLabelModel {
  id: string;
  text: string;
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  color: string;
  rotationDegrees: number;
  hierarchy: LabelTone;
}

export type RenderOverlayModel =
  | {
      id: string;
      type: "feature-path";
      path: string;
      stroke: string;
      strokeWidth: number;
      opacity: number;
      fill?: string;
      dashArray?: string;
      halo?: string;
    }
  | {
      id: string;
      type: "screen-box";
      x: number;
      y: number;
      width: number;
      height: number;
      borderColor: string;
      borderWidth: number;
      glow?: string;
    }
  | {
      id: string;
      type: "crosshair";
      x: number;
      y: number;
      size: number;
      stroke: string;
      strokeWidth: number;
      opacity: number;
    }
  | {
      id: string;
      type: "marker";
      x: number;
      y: number;
      text: string;
      color: string;
      stemColor: string;
    }
  | {
      id: string;
      type: "ellipse";
      x: number;
      y: number;
      width: number;
      height: number;
      borderColor: string;
      borderWidth: number;
      borderStyle: "solid" | "dashed";
      opacity: number;
      fill?: string;
      blurPx?: number;
      transform?: string;
    };

export interface RenderBBoxModel {
  source: ExtentMode;
  coordinates: BBox;
}

export interface SurfaceRenderScene {
  nodes: RenderNodeModel[];
  rings: RenderRingModel[];
  vectors: RenderVectorModel[];
  labels: RenderLabelModel[];
  overlays: RenderOverlayModel[];
  bbox: RenderBBoxModel;
  diagnostics: GeometryDiagnostics;
}

export interface GeometryScene {
  nodes: NodeModel[];
  rings: RingModel[];
  vectors: VectorModel[];
  labels: LabelModel[];
  overlays: OverlayModel[];
  bbox: BBoxModel;
  diagnostics: GeometryDiagnostics;
  surfaces: Record<WorkspaceMode, SurfaceRenderScene>;
}

export interface SurfaceViewProps {
  geometryScene: GeometryScene;
  selectedFeature: Feature;
  surfaceConfig: SurfaceConfig;
  debugGeometry: boolean;
  setSelectedId: (id: string) => void;
}
