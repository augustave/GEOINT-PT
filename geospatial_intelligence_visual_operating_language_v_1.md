# Geospatial Intelligence Visual Operating Language v1

## Conclusion
This document defines a **visual operating language** for intelligence-style geospatial products: a system that merges archival dossier materiality, tactical signal design, and precise map logic into one reusable frontend grammar.

The goal is not to make a generic dashboard. The goal is to create a product language that feels like:
- a bound field dossier
- a live operational surface
- a traceable evidence environment
- a disciplined geospatial instrument

This operating language is organized into six layers:
1. Doctrine
2. Tokens
3. Component Inventory
4. Map Primitive Rules
5. State Matrix
6. Template Screens

---

## Traditional Approach:
A standard geospatial design system usually starts with widgets: map, filter, card, table, modal. That approach is functional, but it often produces software that feels visually interchangeable.

In this system, function still matters, but the experience is organized around a stronger premise:

**Every interaction should feel like handling structured intelligence, not browsing generic SaaS.**

---

## Innovative Approach:
Treat the interface as a **field-archive operating language**.

That means every layer of the product should reinforce four conditions at once:
- **material credibility** — the interface feels handled, indexed, and structured
- **operational tension** — active signals feel urgent and legible
- **evidentiary traceability** — information looks attributable, filterable, and reviewable
- **geospatial discipline** — the map behaves like a true spatial instrument, not a decorative backdrop

---

# 1. Doctrine

## 1.1 Core Thesis
This product language is built on the union of two worlds:
- **archival order**
- **operational signal**

The archive provides structure, legibility, and credibility.
The signal provides urgency, contrast, and action.
The map provides spatial truth.

## 1.2 Design Principles

### 1. Material Before Gloss
Surfaces should feel like substrate, stock, file tabs, printed labels, acetate overlays, clipped inserts, or indexed sheets.

### 2. Signal Is Scarce
Bright colors are not decorative. They mean activation, anomaly, urgency, selection, or confirmed significance.

### 3. Density Without Noise
Crowded information is acceptable. Ambiguity is not. The system should tolerate dense views while preserving hierarchy.

### 4. Evidence Over Ornament
Every visual flourish should correspond to a function: indexing, hierarchy, alerting, grouping, filtering, or annotating.

### 5. Spatial Truth Is Non-Negotiable
The map must remain mathematically honest. Styling can be expressive, but geometry, projection, ordering, and zoom behavior must remain disciplined.

### 6. Human Parsing First
The interface should help a human skim, compare, isolate, and verify quickly.

## 1.3 Anti-Principles
This system should avoid:
- glassmorphism
- glossy gradient futurism
- ornamental neon everywhere
- cartoon map icons
- soft consumer-app roundedness
- abstract black-box automation language
- decorative motion that weakens evidentiary trust

## 1.4 Product Tone
The tone of the interface should feel:
- precise
- restrained
- indexed
- high-context
- operational
- inspectable
- credible

Not:
- playful
- frictionless in a vague way
- empty-minimal
- over-animated
- entertainment-like

---

# 2. Tokens

## 2.1 Token Strategy
Tokens convert aesthetic instinct into reusable product rules. All components, maps, and layouts should pull from shared token families.

## 2.2 Color Tokens

### Surface / Substrate
- `color.surface.kraft.100`
- `color.surface.kraft.200`
- `color.surface.paper.100`
- `color.surface.paper.200`
- `color.surface.board.300`
- `color.surface.ink.900`

### Structural Ink
- `color.text.primary`
- `color.text.secondary`
- `color.text.muted`
- `color.border.default`
- `color.border.strong`
- `color.grid.subtle`

### Signal / Tactical Accent
- `color.signal.alert.flare`
- `color.signal.warning.amber`
- `color.signal.active.acid`
- `color.signal.trace.rose`
- `color.signal.route.ember`
- `color.signal.verified.cyan`

### Semantic Status
- `color.status.default`
- `color.status.selected`
- `color.status.filtered`
- `color.status.stale`
- `color.status.disabled`
- `color.status.critical`

## 2.3 Typography Tokens
- `type.display.xl`
- `type.display.l`
- `type.section.m`
- `type.label.s`
- `type.meta.xs`
- `type.code.xs`

### Typography Rules
- Headings are condensed, structured, and high-contrast
- Metadata uses smaller, denser styles
- Coordinates, timestamps, IDs, and evidence references use monospace or pseudo-monospaced treatment

## 2.4 Space Tokens
- `space.2`
- `space.4`
- `space.8`
- `space.12`
- `space.16`
- `space.24`
- `space.32`

## 2.5 Stack / Offset Tokens
- `offset.stack.xs`
- `offset.stack.sm`
- `offset.stack.md`
- `rotate.stack.none`
- `rotate.stack.soft`
- `rotate.stack.note`

## 2.6 Stroke / Border Tokens
- `stroke.hairline`
- `stroke.standard`
- `stroke.emphasis`
- `border.tab.cut`
- `border.card.frame`
- `border.alert.outline`

## 2.7 Elevation Tokens
- `shadow.card.low`
- `shadow.card.mid`
- `shadow.stack.depth`
- `shadow.overlay.focus`

## 2.8 Motion Tokens
- `motion.pullforward.fast`
- `motion.filter.shift.fast`
- `motion.overlay.fade.quick`
- `motion.alert.pulse.restrained`
- `motion.map.transition.standard`

### Motion Rules
- Motion should clarify sorting, reveal, selection, or status change
- Motion should never feel cinematic for its own sake
- Alert motion should be rare and restrained

## 2.9 Map Tokens
- `map.point.default`
- `map.point.alert`
- `map.point.cluster`
- `map.line.route`
- `map.line.boundary`
- `map.polygon.zone`
- `map.label.primary`
- `map.label.secondary`
- `map.selection.halo`
- `map.hatch.operational`

---

# 3. Component Inventory

## 3.1 Structural Components

### DossierShell
Primary product frame. Houses header, workspace, indexed side rails, and content panes.

### StackCard
Card primitive for entities, incidents, reports, sites, or alerts.
Supports overlap, drag ordering, and pull-forward emphasis.

### TabRail
Vertical or horizontal indexing rail for switching major slices of the workspace.
Examples: entities, incidents, routes, sectors, reports.

### MetadataStrip
Dense info strip for timestamps, confidence, coordinates, IDs, source, and operator attribution.

### FilterBand
A visible active-filter ribbon showing current layer, query, region, time window, or evidence scope.

### StatusChip
Semantic indicator for confidence, freshness, severity, source class, or operational state.

### SplitPane
Two-region or three-region workspace layout. Often map + dossier, or list + detail + map.

## 3.2 Map-Adjacent Components

### GeoCanvas
Primary map surface. Supports layer switching, feature highlighting, and dossier linking.

### LayerLegend
Explicit layer control with visibility, density, and semantic keys.

### IntelTooltip
Hover or focus card for a feature. Includes name, type, timestamp, confidence, and quick actions.

### SelectionHalo
Visual primitive for selected or traced geospatial features.

### RouteInspector
Context panel for route length, segment logic, constraints, and associated events.

### ZoneSheet
Detail panel for polygons, sectors, regions, or influence areas.

## 3.3 Evidence & Record Components

### EvidenceCallout
Anchored annotation linking a map feature to a note, claim, image, excerpt, or report section.

### SourceBlock
Compact provenance block for source name, date, capture method, reliability, and chain of custody.

### TimelineStrip
Dense chronological strip showing event sequence, changes, or alert history.

### CompareTray
Container for pinning multiple items side-by-side.

## 3.4 Utility Components
- SearchField
- CoordinateReadout
- ZoomControl
- DateWindowSelector
- QueryScopeToggle
- ExportSheet
- EmptyStatePanel
- LoadingSkeleton

---

# 4. Map Primitive Rules

## 4.1 Geometry Contracts
The map system must explicitly style data by geometry type.

### Point
Represents:
- sites
- incidents
- assets
- observations
- sensors
- checkpoints

Default behavior:
- fixed visual size within defined zoom bands
- no decorative iconography by default
- strong semantic color assignment
- optional ring, halo, or dossier callout on selection

### MultiPoint
Represents batched observations or repeated detections.
Should inherit point logic while allowing cluster summarization.

### LineString
Represents:
- routes
- links
- corridors
- boundaries in stroke form
- transmission paths

Rules:
- route lines must remain crisp and direct
- use minimal caps and joins unless semantics demand otherwise
- preserve hierarchy through stroke weight and signal color, not embellishment

### MultiLineString
Used when one conceptual route or corridor is discontinuous.
Must still read as one grouped operational object.

### Polygon
Represents:
- regions
- sectors
- zones
- search areas
- influence fields
- boundaries

Rules:
- fills should remain flat, restrained, and readable under point density
- use hatch, edge emphasis, or low-opacity tint rather than muddy gradients
- avoid visual treatments that obscure smaller features beneath

### MultiPolygon
Used for fragmented or distributed operational areas.
Should preserve same semantic identity across all fragments.

### FeatureCollection
Represents a composed scene. This is the unit of operational context.

## 4.2 Layer Hierarchy
This is a hard invariant:
1. substrate / base context
2. terrain or neutral geography
3. polygons and operational zones
4. routes and lines
5. points and clusters
6. labels and identifiers
7. selections, traces, and alerts
8. interaction overlays and callouts

## 4.3 Semantic Style Mapping
Each feature must carry, at minimum:
- `geometry_type`
- `entity_type`
- `operational_state`
- `priority`
- `confidence`
- `freshness`
- `source_class`

These attributes determine styling more reliably than color-only category assignment.

## 4.4 Zoom Logic

### Low Zoom
- aggregate small points into density-aware clusters
- suppress minor labels
- preserve major corridors and zones

### Mid Zoom
- reveal individual points for selected classes
- show route labels and major site IDs
- maintain fixed-size tactical markers where useful

### High Zoom
- reveal detailed labels, timestamps, and local evidence links
- enable route node inspection and incident-level detail

## 4.5 Selection Rules
Selected features should use a consistent hierarchy:
- halo or outline first
- linked dossier highlight second
- detail panel expansion third

The selected state should never make the base map unreadable.

## 4.6 Clustering Rules
Clusters should represent accumulation, not blur.

Preferred methods:
- overlap density
- count badge
- ring weight
- stacked micro-dot logic

Avoid soft, cloud-like density markers unless explicitly required.

## 4.7 Labeling Rules
Labels must appear by threshold and priority.

Primary labels:
- site names
- major route identifiers
- high-priority incident IDs

Secondary labels:
- metadata
- minor locality names
- timestamps
- confidence indicators

## 4.8 Projection Rules
If the system uses measurable radii, boundaries, or distance-sensitive overlays, drawing must respect the map engine’s projection rules.

The visual language may feel tactile, but the geospatial math must remain exact.

---

# 5. State Matrix

## 5.1 Global States
Every component and feature should support a shared vocabulary:
- default
- hover
- focus
- active
- selected
- compared
- filtered
- muted
- disabled
- stale
- alert
- loading
- empty
- error

## 5.2 State Behavior Rules

### Default
Clear structure, restrained contrast, baseline metadata visibility.

### Hover
Minor emphasis only. Enough to indicate inspectability.

### Focus
Keyboard-visible and high-contrast. Must work across tabs, layers, chips, cards, and controls.

### Active
Used for currently engaged control or applied interaction context.

### Selected
Persistent emphasis. Must propagate across map, card, and detail pane.

### Compared
Used when multiple entities are pinned for side-by-side inspection.

### Filtered
Items outside the current scope remain visible only if context demands it. Otherwise they mute.

### Muted
Lower contrast, reduced metadata, still spatially present.

### Disabled
Function unavailable. Never confused with filtered.

### Stale
Information is visible but aged. Requires explicit freshness cue.

### Alert
Rare, bright, and urgent. Reserve for true operational significance.

### Loading
Use skeletons, substrate placeholders, or indexed pending states rather than generic spinners wherever possible.

### Empty
Should still maintain the dossier structure, with explanation and next-step cues.

### Error
Must preserve traceability. State should explain what failed: source, layer, geometry load, filter query, or export step.

## 5.3 Cross-Surface Synchronization
Any selected or alert state should synchronize across:
- map feature
- list row
- card
- detail pane
- timeline position
- evidence callout

That cross-highlighting is one of the core signatures of the operating language.

---

# 6. Template Screens

## 6.1 Intelligence Workspace
Primary operating view.

Layout:
- left: tab rail and filter controls
- center: GeoCanvas
- right: active dossier detail panel
- lower strip: timeline or compare tray

Purpose:
- scan live spatial context
- isolate features
- inspect linked evidence
- move between map and record

## 6.2 Entity Dossier
Dedicated profile page for one site, asset, individual, route, region, or incident cluster.

Sections:
- summary header
- metadata strip
- related map excerpt
- timeline
- evidence blocks
- associated entities
- notes / analysis

## 6.3 Incident Timeline Board
Chronological view for event progression.

Purpose:
- track sequence
- compare evidence over time
- jump from event to map location

## 6.4 Route Analysis Workspace
Focused line-based screen for corridor, path, or route behavior.

Includes:
- route geometry
- segment list
- associated zones
- linked incidents
- travel constraints
- compare mode

## 6.5 Sector / Zone Review Screen
Polygon-centered workspace for regions, sectors, or search areas.

Includes:
- boundary summary
- overlap with incidents and routes
- active alerts inside zone
- historical state changes

## 6.6 Compare View
Side-by-side inspection for two or more entities, incidents, or sites.

Use cases:
- verify differences
- compare time windows
- compare overlapping regions
- assess source conflict

## 6.7 Field Report Composer
Structured authoring environment for producing human-readable operational summaries.

Includes:
- selected evidence tray
- excerpt panel
- map snapshot module
- metadata and source insertion
- export logic

---

# Implementation Guidance

## Recommended Stack
- React for component architecture
- MapLibre GL or Mapbox GL for base map interaction
- deck.gl for dense or custom geospatial overlays when needed
- token-driven styling system using CSS variables or a typed design-token pipeline

## Suggested Package Layers
- `foundation/` → doctrine, tokens, naming rules
- `components/` → dossier UI primitives
- `geo/` → feature styling contracts and layer logic
- `patterns/` → list-map sync, compare mode, evidence linking
- `templates/` → full screen compositions

## Naming Guidance
Prefer operational names over generic UI names.

Examples:
- `EntityDossierCard` instead of `InfoCard`
- `LayerLegendRail` instead of `Sidebar`
- `EvidenceCallout` instead of `Tooltip`
- `RouteInspectorPanel` instead of `Drawer`

---

# What I should remember
- This is not a dashboard skin. It is a **field-archive operating language**.
- Signal colors should stay rare and meaningful.
- The map must remain geometrically honest even when the interface feels tactile.
- The winning structure is: **doctrine → tokens → components → map rules → state logic → templates**.
- Cross-highlighting between map, dossier, and evidence is a signature behavior of the system.
- The interface should always feel inspectable, attributable, and operational.

