# Field Archive Geospatial Operating System

## Conclusion
This canvas defines the full system for an intelligence-style geospatial product language: not just the look, but the rules, components, states, data contracts, and screen patterns required to build it consistently.

The system is designed to feel like a fusion of:
- a bound field dossier
- an evidence board
- a live operational map
- a precise analytic instrument

This is not a dashboard skin. It is a product operating language.

---

## Traditional Approach:
A normal design system starts by listing UI widgets: buttons, cards, drawers, tabs, tables, charts. That makes implementation easier, but it often produces software that looks interchangeable.

This system still includes those functional layers, but it organizes them around a more specific doctrine:

**The interface should feel like handling structured intelligence, not browsing generic SaaS.**

So the system begins with doctrine, then tokens, then components, then geospatial rules, then templates.

## Innovative Approach:
Treat the product as a **field-archive operating system**.

That means every surface should preserve four conditions at once:
- **material credibility** — it feels handled, indexed, and structured
- **operational tension** — active signals feel urgent and legible
- **evidentiary traceability** — information looks attributable and reviewable
- **geospatial discipline** — the map behaves like a true spatial instrument

---

# 1. System Identity

## 1.1 System Name
**Field Archive Geospatial Operating System**

Short internal name:
**FAGOS**

Alternative brand-facing naming directions:
- Dossier Map System
- Field Archive OS
- Evidence Terrain System
- Operational Dossier Framework
- IndexMap Language

## 1.2 Purpose
The system exists to support products that need to combine:
- spatial context
- evidence traceability
- dense operational information
- clear hierarchy under pressure
- cross-linking between map, record, timeline, and source material

## 1.3 Intended Product Classes
This system fits:
- intelligence and investigation products
- research terrain products
- site/network monitoring platforms
- strategic operations tools
- incident and route analysis products
- logistics or infrastructure observability tools
- evidence-rich geospatial products

It does not fit:
- playful consumer maps
- lifestyle travel products
- glossy futuristic dashboards
- social or community map products
- decorative “cyber” admin panels

---

# 2. Doctrine

## 2.1 Core Thesis
This interface language is built on the union of three truths:
- **archive** gives structure
- **signal** gives urgency
- **map** gives spatial truth

The system should always feel inspectable, attributable, and operational.

## 2.2 Principles

### Principle 1 — Material Before Gloss
Surfaces should feel like paper stock, files, inserts, tabbed dividers, acetate overlays, clipped notes, printed labels, or indexed sheets.

### Principle 2 — Signal Is Scarce
Bright accents are not decoration. They mark active, anomalous, selected, verified, or urgent conditions.

### Principle 3 — Density Without Confusion
The interface may be information-dense. It must never be hierarchy-poor.

### Principle 4 — Evidence Over Ornament
If a visual treatment cannot justify its role in indexing, grouping, alerting, or attribution, it should not exist.

### Principle 5 — Spatial Truth Is Non-Negotiable
The map is not illustration. Projection, ordering, scale behavior, and geometry are real.

### Principle 6 — Human Parsing First
The system should help a human skim, isolate, compare, and verify quickly.

### Principle 7 — Traceability Is Visible
Confidence, freshness, source class, and evidence lineage should be visually accessible.

### Principle 8 — Cross-Surface Continuity
A selected thing should feel like the same thing across map, card, timeline, and detail sheet.

## 2.3 Anti-Principles
Avoid:
- glassmorphism
- excessive gradients
- ornamental neon everywhere
- soft playful rounding
- cute map markers
- decorative motion
- over-smoothed data surfaces
- black-box automation language without explanation

## 2.4 Tone
The product tone should feel:
- precise
- restrained
- indexed
- operational
- inspectable
- credible
- high-context

Not:
- playful
- magical
- vague
- entertainment-like
- glossy for its own sake

---

# 3. Foundational Tokens

## 3.1 Token Strategy
Tokens turn taste into rules. Everything in the system should map back to token families.

## 3.2 Color Tokens

### Surface / Substrate
- `color.surface.kraft.100`
- `color.surface.kraft.200`
- `color.surface.paper.100`
- `color.surface.paper.200`
- `color.surface.board.300`
- `color.surface.ink.900`
- `color.surface.overlay.trace`

### Structural Ink
- `color.text.primary`
- `color.text.secondary`
- `color.text.muted`
- `color.border.default`
- `color.border.strong`
- `color.rule.subtle`
- `color.grid.subtle`

### Signal / Tactical Accent
- `color.signal.alert.flare`
- `color.signal.warning.amber`
- `color.signal.route.ember`
- `color.signal.trace.rose`
- `color.signal.active.acid`
- `color.signal.verified.cyan`
- `color.signal.selection.gold`

### Status Semantics
- `color.status.default`
- `color.status.selected`
- `color.status.filtered`
- `color.status.muted`
- `color.status.stale`
- `color.status.disabled`
- `color.status.critical`
- `color.status.error`
- `color.status.loading`

## 3.3 Typography Tokens
- `type.display.xl`
- `type.display.l`
- `type.section.m`
- `type.section.s`
- `type.label.s`
- `type.meta.xs`
- `type.code.xs`
- `type.caption.xs`

### Typography Rules
- Major headings are structured and compressed
- Supporting metadata is smaller and denser
- Coordinates, timestamps, IDs, and evidence references use code-like styling
- Labels should be readable at speed, not fashionable at the expense of function

## 3.4 Space Tokens
- `space.2`
- `space.4`
- `space.8`
- `space.12`
- `space.16`
- `space.24`
- `space.32`
- `space.40`

## 3.5 Border / Stroke Tokens
- `stroke.hairline`
- `stroke.standard`
- `stroke.emphasis`
- `border.card.frame`
- `border.tab.cut`
- `border.alert.outline`
- `border.zone.edge`

## 3.6 Elevation Tokens
- `shadow.card.low`
- `shadow.card.mid`
- `shadow.stack.depth`
- `shadow.overlay.focus`

## 3.7 Stack / Rotation Tokens
- `offset.stack.xs`
- `offset.stack.sm`
- `offset.stack.md`
- `rotate.stack.none`
- `rotate.stack.soft`
- `rotate.note.analog`

## 3.8 Motion Tokens
- `motion.pullforward.fast`
- `motion.overlay.fade.quick`
- `motion.filter.shift.fast`
- `motion.selection.snap.standard`
- `motion.alert.pulse.restrained`
- `motion.map.transition.standard`

### Motion Rules
- Motion explains state, not atmosphere
- Motion is allowed for reveal, sort, selection, or synchronization
- Alert motion should be rare and restrained
- Any motion that weakens trust should be removed

## 3.9 Map Tokens
- `map.point.default`
- `map.point.alert`
- `map.point.cluster`
- `map.line.route`
- `map.line.boundary`
- `map.line.trace`
- `map.polygon.zone`
- `map.polygon.search`
- `map.label.primary`
- `map.label.secondary`
- `map.selection.halo`
- `map.hatch.operational`

---

# 4. Layout Grammar

## 4.1 Global Layout Modes
The system has four core page modes:
- **map-primary**
- **dossier-primary**
- **timeline-primary**
- **compare-primary**

## 4.2 Structural Regions
A screen may contain some or all of the following:
- header band
- tab rail
- filter band
- list rail
- main map canvas
- dossier detail pane
- compare tray
- timeline strip
- evidence drawer
- export/utility sheet

## 4.3 Spatial Behavior
- Primary tasks should never depend on modal-only access
- The map should remain visible in map-primary tasks whenever possible
- Detail views should not sever context from list or map state
- Filters should stay visibly active
- Dense work should be pane-based, not popover-fragile

## 4.4 Width Logic
- rails are narrow and index-driven
- detail panes are information-dense but bounded
- map canvas is elastic and central
- compare trays are horizontal and pin-based

---

# 5. Component Inventory

## 5.1 Structural Components

### DossierShell
The root workspace frame.

Contains:
- header band
- navigation index
- main work region
- optional utility/footer strip

Behavior:
- preserves active query scope
- keeps global filters visible
- anchors cross-surface selection state

### HeaderBand
Top-level context strip.

Contains:
- workspace title
- region or query context
- date window
- alert summary
- export actions

### TabRail
Indexed navigation rail.

Common tabs:
- entities
- incidents
- routes
- sectors
- reports
- sources
- compare

Behavior:
- supports active, hover, focus, disabled
- optionally includes counts or activity badges

### FilterBand
Persistent active-filter surface.

Contains:
- layer toggles
- time window
- source filters
- confidence range
- geometry types
- region scope
- clear/reset actions

### SplitPane
Pane composition primitive.

Patterns:
- map + dossier
- list + map + detail
- compare + detail
- timeline + map

## 5.2 Record Components

### StackCard
Primary record card.

Use for:
- incidents
- sites
- reports
- routes
- sources
- alerts

Fields:
- title
- entity type
- time/freshness
- confidence
- source class
- region or coordinates
- short summary

States:
- default
- hover
- selected
- compared
- muted
- stale
- alert

### DossierCard
Expanded form of StackCard.

Adds:
- tabs
- evidence snippets
- related entities
- key metadata
- map excerpt

### MetadataStrip
Dense metadata row.

Supports:
- timestamps
- coordinates
- object IDs
- confidence
- source type
- owner/operator
- region tags

### StatusChip
Compact semantic badge.

Usage:
- verified
- unverified
- stale
- critical
- simulated
- filtered
- archived

### EvidenceCallout
Anchored evidence marker.

Behavior:
- links source material to a record or geometry
- shows provenance and extraction context
- opens related report or detail view

### SourceBlock
Provenance cluster.

Fields:
- source name
- source class
- capture date
- reliability label
- chain-of-custody or derivation note

## 5.3 Geospatial Components

### GeoCanvas
Primary geospatial surface.

Must support:
- layer visibility
- hover inspection
- selection
- linked highlighting
- geometry filtering
- time-window changes
- zoom-dependent styling

### LayerLegend
Visible layer management.

Contains:
- layer name
- semantic color
- visibility toggle
- density mode when relevant
- count or summary

### IntelTooltip
Hover/focus surface for a feature.

Contains:
- title
- type
- timestamp
- confidence
- priority
- quick actions

### SelectionHalo
Selection treatment for map features.

Rules:
- always readable against substrate
- can synchronize with detail panel
- should not obscure local geometry

### RouteInspector
Detail structure for line-based entities.

Contains:
- segment summary
- length / distance
- associated sites
- constraints
- historical changes

### ZoneSheet
Detail structure for polygon-based entities.

Contains:
- zone type
- area
- related incidents
- overlap layers
- state history

### CoordinateReadout
Pointer or selection coordinate display.

Behavior:
- updates on cursor move or selected feature
- can switch between display formats when needed

## 5.4 Time Components

### TimelineStrip
Dense chronological strip.

Behavior:
- scrollable by time window
- linked to map and record selection
- shows event density and key markers

### TimeWindowSelector
Global temporal scope control.

Behavior:
- quickly shifts analysis window
- clearly indicates current scope
- preserves traceability of filtered state

## 5.5 Compare Components

### CompareTray
Pinned comparison surface.

Behavior:
- stores multiple selected items
- normalizes shared fields
- highlights differences in metadata and map location

### DeltaBlock
Difference indicator.

Use for:
- route changes
- source disagreement
- confidence shifts
- state changes over time

## 5.6 Utility Components
- SearchField
- QueryScopeToggle
- ExportSheet
- EmptyStatePanel
- LoadingSkeleton
- ErrorPanel
- ActionStrip
- AnnotationComposer

---

# 6. Geospatial Data Language

## 6.1 Geometry Contracts
The UI must style data by geometry class and semantics.

### Point
Represents:
- incidents
- sensors
- assets
- sites
- observations
- checkpoints

Rules:
- fixed visual size within defined zoom bands
- no cartoon icon by default
- selection uses halo or ring, not oversized bounce behavior
- labels appear by threshold and priority

### MultiPoint
Represents grouped observations.

Rules:
- should retain class identity
- may cluster or summarize depending on zoom and density

### LineString
Represents:
- routes
- corridors
- transmission paths
- links
- boundaries in line form

Rules:
- strokes should be crisp and direct
- signal color should carry class or urgency, not decoration
- segment behavior should remain inspectable

### MultiLineString
Represents fragmented but conceptually unified line objects.

Rules:
- preserve single identity across discontinuous parts
- keep consistent selection logic

### Polygon
Represents:
- sectors
- regions
- search areas
- operational zones
- service areas
- influence boundaries

Rules:
- flat restrained fills
- optional hatch or edge emphasis
- avoid heavy opacity that buries points and labels

### MultiPolygon
Represents fragmented or distributed areas.

Rules:
- shared semantics across all pieces
- a single zone should still read as one logical object

### FeatureCollection
Represents a complete operational scene.

Rules:
- layer ordering must remain deterministic
- collection-level filtering should be inspectable and reversible

## 6.2 Required Semantic Fields
Every feature should provide, at minimum, where applicable:
- `id`
- `geometry_type`
- `entity_type`
- `operational_state`
- `priority`
- `confidence`
- `freshness`
- `source_class`
- `time_start`
- `time_end`
- `label_primary`

Optional but valuable:
- `evidence_refs`
- `owner`
- `region_code`
- `status_reason`
- `compare_group`
- `classification_hint`

## 6.3 Layer Hierarchy
This is a hard invariant:
1. base substrate
2. neutral terrain / context geography
3. polygons and zones
4. lines and routes
5. points and clusters
6. labels and identifiers
7. selections, traces, and alerts
8. interaction overlays and callouts

## 6.4 Zoom Rules

### Low Zoom
- aggregate minor points
- preserve major routes and regions
- suppress secondary labels
- emphasize macro context

### Mid Zoom
- reveal individual points for selected classes
- display route identifiers
- show more site names and category labels

### High Zoom
- reveal local evidence links
- allow point-level inspection
- show detailed IDs, timestamps, and per-segment route data

## 6.5 Clustering Rules
Clusters should read as accumulation, not blur.

Preferred methods:
- count badge
- overlap density
- ring weight
- stacked micro-dot logic

Avoid soft cloud-like blobs unless the product explicitly needs probabilistic field views.

## 6.6 Selection Rules
Selection order:
1. map halo or outline
2. linked card highlight
3. detail panel expansion
4. timeline synchronization
5. evidence surface emphasis

## 6.7 Label Rules
Primary labels:
- site names
- important route IDs
- high-priority incidents
- selected object titles

Secondary labels:
- local references
- timestamps
- confidence markers
- short metadata

## 6.8 Projection Rules
Any measurable radius, area, or distance-sensitive overlay must respect the map engine’s projection logic.

The interface may feel tactile, but the geometry must remain correct.

---

# 7. State Matrix

## 7.1 Shared States
Every component should support this common vocabulary:
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

## 7.2 State Meanings

### Default
Baseline structure with core metadata visible.

### Hover
Minor emphasis indicating inspectability.

### Focus
Keyboard-visible, high-clarity, and consistent across rails, cards, toggles, chips, and controls.

### Active
Currently engaged control or active scope.

### Selected
Persistent emphasis across all relevant surfaces.

### Compared
Pinned for side-by-side evaluation.

### Filtered
Inside active scope and visually affirmed.

### Muted
Still present, but outside current emphasis.

### Disabled
Unavailable action or inaccessible mode.

### Stale
Visible but aged. Requires a freshness cue.

### Alert
Reserved for real significance. Rare, bright, and unmistakable.

### Loading
Prefer skeletons or substrate placeholders to generic spinners.

### Empty
Maintains structure while explaining absence.

### Error
Must explain what failed: source, geometry load, query, layer, or export.

## 7.3 Synchronization Rule
Selected or alert state should synchronize across:
- map feature
- card or row
- detail pane
- timeline mark
- evidence reference
- compare tray when pinned

This cross-highlighting is one of the defining behaviors of the system.

---

# 8. Information Architecture

## 8.1 Core User Loops

### Loop A — Scan
User opens workspace, reads active region and filters, scans map and summary counts.

### Loop B — Isolate
User filters by time, type, source, or region.

### Loop C — Inspect
User selects a feature or record and opens dossier detail.

### Loop D — Verify
User checks metadata, source block, evidence callout, and freshness.

### Loop E — Compare
User pins multiple entities or time states to compare.

### Loop F — Report
User exports or composes a field report from selected evidence.

## 8.2 Navigation Model
Primary navigation should organize by analytic object, not generic app sections.

Recommended primary categories:
- Entities
- Incidents
- Routes
- Zones
- Reports
- Sources
- Compare

---

# 9. Screen Templates

## 9.1 Intelligence Workspace
Primary operating view.

Layout:
- left rail: tabs and filters
- center: GeoCanvas
- right pane: dossier detail
- bottom strip: timeline or compare tray

Goals:
- scan live spatial context
- identify anomalies
- inspect a selected object
- preserve active filter scope

## 9.2 Entity Dossier
Single-object profile view.

Sections:
- title band
- metadata strip
- map excerpt
- evidence blocks
- related entities
- timeline
- notes and status history

## 9.3 Incident Timeline Board
Time-first investigation layout.

Goals:
- track sequence
- compare evidence over time
- jump to map context
- evaluate freshness and source conflict

## 9.4 Route Analysis Workspace
Line-centric view.

Sections:
- map route focus
- segment list
- route metadata
- associated incidents
- compare mode
- route history

## 9.5 Sector / Zone Review
Polygon-centric view.

Sections:
- zone summary
- overlap layers
- incidents in area
- route intersections
- state history
- evidence references

## 9.6 Compare View
Pinned multi-item comparison.

Goals:
- compare records
- spot deltas
- resolve contradictions
- evaluate priority differences

## 9.7 Field Report Composer
Structured authoring surface.

Sections:
- selected evidence tray
- excerpt editor
- map snapshot block
- provenance insertions
- export controls

---

# 10. Content Language

## 10.1 Naming Rules
Prefer operational names over generic widget names.

Examples:
- `EntityDossierCard` instead of `InfoCard`
- `LayerLegendRail` instead of `Sidebar`
- `EvidenceCallout` instead of `Tooltip`
- `RouteInspectorPanel` instead of `Drawer`
- `MetadataStrip` instead of `Subheader`

## 10.2 Copy Style
Text should be:
- concise
- traceable
- low-drama
- specific
- consistent

Prefer:
- “Observed at 14:32 UTC”
- “Confidence: Medium”
- “Source class: Sensor ingest”
- “Last verified: 2h ago”

Avoid:
- vague humanized filler
- marketing language inside operational surfaces
- unexplained acronyms when user context is mixed

## 10.3 Timestamp and ID Treatment
- timestamps should be consistent within a workspace
- IDs should be visually distinguishable from prose
- coordinate formats should be explicit and stable

---

# 11. Accessibility Rules

## 11.1 Core Accessibility Requirements
- keyboard access for rails, filters, list rows, compare tray, and map-linked objects
- visible focus styling
- contrast-safe signal usage
- reduced-motion support
- semantic labeling for map-linked controls and evidence references
- no signal meaning conveyed by color alone

## 11.2 Dense UI Accessibility
Because the system is intentionally dense:
- grouping must be strong
- labels must be short and consistent
- active scope should always be visible
- hover-only information must have focus-accessible equivalents

---

# 12. Performance Rules

## 12.1 Rendering Priorities
- preserve interaction speed over decorative richness
- cluster when low zoom density becomes unreadable
- defer heavy overlays where possible
- keep selection and hover responsive

## 12.2 Data Behavior
- large layers should degrade gracefully
- stale or unavailable sources should remain traceable
- loading states should preserve spatial and structural context

---

# 13. Implementation Architecture

## 13.1 Recommended Stack
- React for component architecture
- MapLibre GL or Mapbox GL for the base map
- deck.gl for advanced overlays when density or custom rendering is needed
- token-driven CSS variables or typed design-token pipeline

## 13.2 Package Structure

```text
foundation/
  doctrine.md
  tokens.json
  content-rules.md
components/
  DossierShell.tsx
  HeaderBand.tsx
  TabRail.tsx
  FilterBand.tsx
  StackCard.tsx
  MetadataStrip.tsx
  StatusChip.tsx
  EvidenceCallout.tsx
geo/
  GeoCanvas.tsx
  LayerLegend.tsx
  RouteInspector.tsx
  ZoneSheet.tsx
  feature-style-contracts.ts
patterns/
  list-map-sync.ts
  compare-mode.ts
  timeline-linking.ts
  evidence-linking.ts
screens/
  IntelligenceWorkspace.tsx
  EntityDossier.tsx
  IncidentTimelineBoard.tsx
  RouteAnalysisWorkspace.tsx
  ZoneReview.tsx
  CompareView.tsx
  FieldReportComposer.tsx
```

## 13.3 Suggested Data Contract

```json
{
  "id": "INC-0142",
  "geometry_type": "Point",
  "entity_type": "incident",
  "operational_state": "active",
  "priority": "high",
  "confidence": "medium",
  "freshness": "recent",
  "source_class": "sensor_ingest",
  "time_start": "2026-03-22T14:32:00Z",
  "time_end": null,
  "label_primary": "Checkpoint Delta Event",
  "region_code": "SECTOR-07",
  "evidence_refs": ["SRC-201", "IMG-044"]
}
```

## 13.4 Feature Style Contract Example

```ts
interface FeatureStyleContract {
  geometryType: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon";
  entityType: string;
  operationalState: string;
  priority: "low" | "medium" | "high" | "critical";
  confidence: "low" | "medium" | "high";
  freshness: "recent" | "aging" | "stale";
  sourceClass: string;
  isSelected?: boolean;
  isFiltered?: boolean;
  isCompared?: boolean;
}
```

---

# 14. MVP Definition

## 14.1 Minimum Viable System
Version 1 should include:
- DossierShell
- HeaderBand
- TabRail
- FilterBand
- GeoCanvas
- LayerLegend
- StackCard
- DossierCard
- MetadataStrip
- StatusChip
- IntelTooltip
- TimelineStrip
- CompareTray
- one map-primary screen
- one dossier screen

## 14.2 Version 2 Expansion
Then add:
- RouteInspector
- ZoneSheet
- FieldReportComposer
- evidence authoring
- export module
- richer compare deltas
- advanced density overlays

---

# 15. Design Review Checklist

## 15.1 Visual Review
- Does the surface feel indexed rather than decorative?
- Are signal colors rare and meaningful?
- Is the hierarchy readable under density?
- Does the selected state remain precise?

## 15.2 Geospatial Review
- Is geometry treated honestly?
- Does zoom behavior remain legible?
- Are clusters informative rather than muddy?
- Is layer order deterministic?

## 15.3 Product Review
- Can a user scan, isolate, inspect, verify, compare, and report?
- Are active filters always visible?
- Does the map stay connected to records and evidence?
- Is freshness and provenance visible enough?

---

# 16. What I should remember
- This is a **field-archive operating system**, not a dashboard skin.
- The strongest identity comes from **archive + signal + map truth**.
- Signal colors must remain rare.
- Cross-highlighting between map, dossier, and evidence is a signature behavior.
- The system only works if geospatial math stays disciplined.
- Build in this order: **doctrine → tokens → components → geo rules → templates → implementation**.

