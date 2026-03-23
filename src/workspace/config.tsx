import {
  AlertTriangle,
  FileText,
  Globe2,
  Layers3,
  MapPinned,
  Monitor,
  Route,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { ScreenFamilySpec, WorkspaceMode } from "./types";

export const T = {
  accentOrange: "#ef8f45",
  secondary: "#5fc8d8",
  verified: "#d6dd7b",
  theaterStroke: "#e2c46b",
} as const;

export const AUXILIARY_RAIL_ICONS: LucideIcon[] = [MapPinned, AlertTriangle, Route, FileText, Layers3];

export const SCREEN_FAMILY_SPECS: Array<ScreenFamilySpec & { Icon: LucideIcon }> = [
  {
    id: "flat-map",
    name: "Flat Map",
    shortName: "Map Core",
    role: "Truth surface",
    question: "Where is it?",
    view: "2D",
    geometryBehavior: "BBox truth",
    selectionPersistence: "strong",
    compareRole: "strong",
    behaviorSummary: "Point, line, and polygon truth driven by bbox fit and shared dossier state.",
    Icon: MapPinned,
  },
  {
    id: "eo-overlay",
    name: "EO Overlay",
    shortName: "EO Overlay",
    role: "Exploitation surface",
    question: "What do we see?",
    view: "Sensor overlay",
    geometryBehavior: "Directional annotation",
    selectionPersistence: "strong",
    compareRole: "medium",
    behaviorSummary: "Overhead exploitation with aimpoints, markup, directional cues, and measured context.",
    Icon: Target,
  },
  {
    id: "site-3d",
    name: "Site 3D",
    shortName: "Site 3D",
    role: "Local context surface",
    question: "What is happening locally?",
    view: "Oblique 3D",
    geometryBehavior: "Site-focused",
    selectionPersistence: "strong",
    compareRole: "medium",
    behaviorSummary: "Local oblique surface for selected-site framing and task-asset context.",
    Icon: Globe2,
  },
  {
    id: "theater-3d",
    name: "Theater 3D",
    shortName: "Theater 3D",
    role: "Mission geometry surface",
    question: "How does it relate operationally?",
    view: "3D operational",
    geometryBehavior: "Rings, routes, vectors",
    selectionPersistence: "strong",
    compareRole: "strong",
    behaviorSummary: "Mission geometry surface for rings, route vectors, and tasking relationships.",
    Icon: Route,
  },
  {
    id: "ops-wall",
    name: "Ops Wall",
    shortName: "Ops Wall",
    role: "Supervisory surface",
    question: "What is happening overall?",
    view: "Dashboard",
    geometryBehavior: "Summary aggregation",
    selectionPersistence: "strong",
    compareRole: "summary",
    behaviorSummary: "Supervisory surface for mission clocks, queue panels, and command monitoring.",
    Icon: Monitor,
  },
];

export const SCREEN_FAMILY_BY_ID = Object.fromEntries(
  SCREEN_FAMILY_SPECS.map((spec) => [spec.id, spec])
) as Record<WorkspaceMode, (typeof SCREEN_FAMILY_SPECS)[number]>;

export const LAYERS = [
  { id: "zones", label: "Zones" },
  { id: "routes", label: "Routes" },
  { id: "incidents", label: "Incidents" },
  { id: "sites", label: "Sites" },
] as const;

export const WORKSPACE_INVARIANTS = ["Selection", "Compare", "BBox", "Dossier"] as const;
