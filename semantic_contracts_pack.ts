export type GeometryType =
  | "Point"
  | "MultiPoint"
  | "LineString"
  | "MultiLineString"
  | "Polygon"
  | "MultiPolygon";

export type EntityType =
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
  | "custom";

export type OperationalState =
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

export type Priority = "low" | "medium" | "high" | "critical";

export type Confidence = "low" | "medium" | "high" | "confirmed";

export type Freshness = "recent" | "aging" | "stale" | "unknown";

export type SourceClass =
  | "sensor_ingest"
  | "human_report"
  | "derived_analysis"
  | "external_feed"
  | "manual_entry"
  | "system_generated"
  | "historical_archive"
  | "simulation"
  | "unknown";

export type TimePrecision =
  | "exact"
  | "minute"
  | "hour"
  | "day"
  | "range"
  | "unknown";

export type CompareEligibility =
  | "eligible"
  | "ineligible"
  | "context_only";

export type LabelPriority = "primary" | "secondary" | "suppressed";

export type ViewMode =
  | "map-primary"
  | "dossier-primary"
  | "timeline-primary"
  | "compare-primary";

export type LayerVisibility = "visible" | "hidden" | "muted";

export type SelectionSource = "map" | "list" | "timeline" | "evidence" | "compare";

export interface CoordinatePoint {
  lng: number;
  lat: number;
}

export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface TimeState {
  start?: string | null;
  end?: string | null;
  lastObservedAt?: string | null;
  lastVerifiedAt?: string | null;
  precision: TimePrecision;
  freshness: Freshness;
}

export interface EvidenceRef {
  id: string;
  title: string;
  sourceId: string;
  sourceClass: SourceClass;
  excerpt?: string;
  captureAt?: string | null;
  reliability?: Confidence;
  url?: string;
  mediaType?: "text" | "image" | "video" | "audio" | "document" | "unknown";
  chainOfCustodyNote?: string;
}

export interface SourceDescriptor {
  id: string;
  name: string;
  sourceClass: SourceClass;
  reliability: Confidence;
  provider?: string;
  captureMethod?: string;
  capturedAt?: string | null;
  lastUpdatedAt?: string | null;
}

export interface LabelSet {
  primary: string;
  secondary?: string;
  shortCode?: string;
  labelPriority?: LabelPriority;
}

export interface FeatureStyleContract {
  geometryType: GeometryType;
  entityType: EntityType;
  operationalState: OperationalState;
  priority: Priority;
  confidence: Confidence;
  freshness: Freshness;
  sourceClass: SourceClass;
  isSelected?: boolean;
  isHovered?: boolean;
  isCompared?: boolean;
  isFilteredIn?: boolean;
  hasAlert?: boolean;
}

export interface FieldObject {
  id: string;
  geometryType: GeometryType;
  entityType: EntityType;
  labels: LabelSet;
  operationalState: OperationalState;
  priority: Priority;
  confidence: Confidence;
  freshness: Freshness;
  sourceClass: SourceClass;
  time: TimeState;
  evidenceRefs: EvidenceRef[];
  sourceIds: string[];
  compareEligibility: CompareEligibility;
  regionCode?: string;
  owner?: string;
  statusReason?: string;
  tags?: string[];
  metadata?: Record<string, string | number | boolean | null>;
}

export interface GeoFieldObject extends FieldObject {
  geometry:
    | { type: "Point"; coordinates: [number, number] }
    | { type: "MultiPoint"; coordinates: [number, number][] }
    | { type: "LineString"; coordinates: [number, number][] }
    | { type: "MultiLineString"; coordinates: [number, number][][] }
    | { type: "Polygon"; coordinates: [number, number][][] }
    | { type: "MultiPolygon"; coordinates: [number, number][][][] };
  bbox?: BoundingBox;
}

export interface FilterState {
  query?: string;
  entityTypes: EntityType[];
  geometryTypes: GeometryType[];
  operationalStates: OperationalState[];
  priorities: Priority[];
  confidenceLevels: Confidence[];
  freshnessLevels: Freshness[];
  sourceClasses: SourceClass[];
  regionCodes: string[];
  tagSet: string[];
  timeStart?: string | null;
  timeEnd?: string | null;
  showOnlyWithEvidence?: boolean;
  showAlertsOnly?: boolean;
}

export interface LayerState {
  id: string;
  name: string;
  visibility: LayerVisibility;
  order: number;
  entityTypes: EntityType[];
  geometryTypes: GeometryType[];
}

export interface CompareState {
  pinnedObjectIds: string[];
  anchorObjectId?: string;
  enabled: boolean;
}

export interface SelectionState {
  selectedObjectId?: string;
  hoveredObjectId?: string;
  focusedEvidenceRefId?: string;
  source: SelectionSource;
}

export interface MapState {
  center?: CoordinatePoint;
  zoom?: number;
  bearing?: number;
  pitch?: number;
  bbox?: BoundingBox;
}

export interface TimelineState {
  visibleStart?: string | null;
  visibleEnd?: string | null;
  selectedEventId?: string;
}

export interface WorkspaceState {
  viewMode: ViewMode;
  selection: SelectionState;
  compare: CompareState;
  filters: FilterState;
  layers: LayerState[];
  map: MapState;
  timeline: TimelineState;
}

export interface DossierProjection {
  objectId: string;
  title: string;
  subtitle?: string;
  status: OperationalState;
  priority: Priority;
  confidence: Confidence;
  freshness: Freshness;
  sourceClass: SourceClass;
  regionCode?: string;
  primaryTimeLabel?: string;
  coordinateLabel?: string;
  summary?: string;
  evidenceCount: number;
}

export interface CompareProjection {
  objectId: string;
  title: string;
  objectType: EntityType;
  priority: Priority;
  confidence: Confidence;
  freshness: Freshness;
  keyValues: Record<string, string | number | boolean | null>;
}

export function isGeoFieldObject(value: FieldObject | GeoFieldObject): value is GeoFieldObject {
  return "geometry" in value;
}

export function toFeatureStyleContract(object: FieldObject): FeatureStyleContract {
  return {
    geometryType: object.geometryType,
    entityType: object.entityType,
    operationalState: object.operationalState,
    priority: object.priority,
    confidence: object.confidence,
    freshness: object.freshness,
    sourceClass: object.sourceClass,
    hasAlert: object.operationalState === "alert" || object.priority === "critical",
  };
}

export function toDossierProjection(object: FieldObject): DossierProjection {
  return {
    objectId: object.id,
    title: object.labels.primary,
    subtitle: object.labels.secondary,
    status: object.operationalState,
    priority: object.priority,
    confidence: object.confidence,
    freshness: object.freshness,
    sourceClass: object.sourceClass,
    regionCode: object.regionCode,
    primaryTimeLabel: object.time.lastObservedAt ?? object.time.start ?? undefined,
    summary: object.statusReason,
    evidenceCount: object.evidenceRefs.length,
  };
}

export function emptyFilterState(): FilterState {
  return {
    entityTypes: [],
    geometryTypes: [],
    operationalStates: [],
    priorities: [],
    confidenceLevels: [],
    freshnessLevels: [],
    sourceClasses: [],
    regionCodes: [],
    tagSet: [],
    showOnlyWithEvidence: false,
    showAlertsOnly: false,
  };
}

export function createWorkspaceState(): WorkspaceState {
  return {
    viewMode: "map-primary",
    selection: {
      selectedObjectId: undefined,
      hoveredObjectId: undefined,
      focusedEvidenceRefId: undefined,
      source: "map",
    },
    compare: {
      pinnedObjectIds: [],
      enabled: false,
    },
    filters: emptyFilterState(),
    layers: [],
    map: {},
    timeline: {},
  };
}
