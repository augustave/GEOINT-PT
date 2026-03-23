# README — Intelligence Workspace

## Conclusion
This project is a **multi-view geo-intelligence workspace prototype** designed to combine a field-archive interface language with geometry-driven spatial logic.

It is not a generic dashboard and it is not a production application yet.
It is a **working design-and-code prototype** that demonstrates how one operational object can preserve identity across:
- dossier surfaces
- 2D map views
- EO-style overlays
- local 3D site views
- theater-scale 3D views
- command-wall monitoring layouts

The current goal of this repository is to finish and stabilize the prototype so it can become a strong base for the next implementation cycle.

---

## Traditional Approach:
This repository contains a React-based prototype for an intelligence-style workspace with:
- mock GeoJSON-like feature data
- extent and bbox logic
- shared selection and compare state
- multiple screen-family views
- dossier/detail surfaces

## Innovative Approach:
This repository is better understood as a **visual operating language for intelligence-style geospatial products**.

The real point of the project is not only the screens.
It is the combination of:
- **field archive UI**
- **geospatial truth**
- **operational continuity across views**

That is the design thesis that must be preserved as the project evolves.

---

# 1. What this project is

## 1.1 Working title
**Intelligence Workspace**

## 1.2 Core idea
This prototype explores a product system where the same selected object can be interpreted across multiple operational surfaces without losing identity.

Examples:
- a site selected in a list should remain the same site in the map
- a route selected in the main view should remain the same route in compare mode
- a zone should remain the same zone whether seen as a flat polygon, an EO overlay context, or a theater-range construct

## 1.3 Why it exists
Most geospatial interfaces either:
- focus on data but look generic
- or look interesting but treat the map as decoration

This prototype tries to bridge both.

It aims to create a system that feels like:
- a bound field dossier
- an operational intelligence surface
- a map instrument
- a command-and-analysis environment

---

# 2. Current feature set

## 2.1 Shared workspace shell
The current workspace includes:
- left navigation rail
- center-left control/index pane
- center main visualization surface
- right dossier/detail pane

## 2.2 Screen-family modes
The prototype currently supports five main display families:

### 1. Flat Map
A 2D operational map mode with:
- point / line / polygon rendering
- bbox-based framing
- selection highlights
- compare-driven context

### 2. EO Overlay
An overhead imagery-style exploitation surface with:
- target boxes
- measured/range-like annotations
- directional labeling
- selected-object linkage

### 3. Site 3D
A local oblique site view with:
- pseudo-3D projection
- selected target framing
- site-level spatial markers
- task-asset context

### 4. Theater 3D
A theater-scale spatial tasking view with:
- concentric rings
- route vectors
- labels in a spatial field
- mission geometry

### 5. Ops Wall
A command-center composite with:
- time-zone clocks
- mission queue panels
- central operational display
- analytics/status side panels

## 2.3 Shared behavior
Across these modes, the prototype currently supports:
- query filtering
- layer visibility toggles
- selected feature state
- compare item pinning
- extent mode switching
- dossier card selection

---

# 3. Design principles

## 3.1 Field archive before generic dashboard
The interface should feel like structured intelligence handling, not ordinary SaaS.

## 3.2 Geometry truth before surface styling
Even when the view is expressive, spatial objects should still derive from real geometry logic.

## 3.3 One object, many surfaces
A selected object must preserve identity across list, map, compare, and detail views.

## 3.4 Screen families should differ visually, but not behaviorally
The project intentionally uses multiple viewing languages, but they should all remain part of one system.

## 3.5 Signal is scarce
Bright accents should mean something: selection, risk, assignment, alert, or operational focus.

---

# 4. Current technical approach

## 4.1 Stack
Current prototype assumptions:
- React
- TypeScript-style typing inside component logic
- Tailwind-style utility classes
- Framer Motion for lightweight transitions
- lucide-react icons
- shadcn/ui style Card and Button components

## 4.2 Data model
The current prototype uses mock feature objects shaped like simplified GeoJSON features.

Each feature contains:
- `type`
- `geometry`
- `properties`

Supported geometry types right now:
- `Point`
- `LineString`
- `Polygon`

Supported property concepts right now:
- `id`
- `entityType`
- `labelPrimary`
- `labelSecondary`
- `operationalState`
- `priority`
- `confidence`
- `freshness`
- `sourceClass`
- `regionCode`
- `evidenceRefs`
- `summary`
- `timeLabel`

## 4.3 Shared state
The workspace currently depends on a small set of centralized state values:
- `selectedId`
- `query`
- `comparedIds`
- `visibleLayers`
- `extentMode`
- `workspaceMode`

These are the current behavior spine of the prototype.

---

# 5. Spatial logic currently in use

## 5.1 Bounding boxes
The workspace computes:
- per-feature bbox
- visible collection bbox
- compare bbox
- selection bbox
- active bbox for framing

## 5.2 Projection helpers
The prototype currently uses simple internal helpers for:
- flat point projection
- oblique pseudo-3D projection
- polygon and line path generation

## 5.3 Range overlay logic
The project includes sampled-circle behavior via generated ring coordinates.

This matters because it keeps the design aligned with a GeoJSON-compatible mindset rather than inventing fake visual circles with no geometry logic behind them.

## 5.4 Why this matters
The prototype is intentionally trying to avoid a common mistake:
**making the map look operational while actually positioning everything arbitrarily on the screen.**

That is why bbox and projection logic must remain part of the project’s core identity.

---

# 6. Repository intent

## 6.1 What this repository is for
This repository should be treated as:
- a prototype environment
- a visual systems lab
- a geospatial interaction experiment
- a foundation for a more structured next-phase build

## 6.2 What it is not yet
It is not yet:
- a production application
- a real map-engine integration
- a real imagery pipeline
- a real 3D terrain system
- a backend-connected operational product

---

# 7. Recommended file structure

The current single-file prototype is too large for healthy iteration.
The next cycle should move toward something like this:

```text
src/
  components/
    WorkspaceNavRail.tsx
    WorkspaceControlPane.tsx
    WorkspaceHeader.tsx
    WorkspaceDetailPane.tsx
    CompareTray.tsx
    EvidenceList.tsx
  views/
    FlatMapView.tsx
    EOOverlayView.tsx
    Site3DView.tsx
    Theater3DView.tsx
    OpsWallView.tsx
  lib/
    geoMath.ts
    bbox.ts
    projections.ts
    featureStyles.ts
    mockData.ts
    featureSelectors.ts
  types/
    geo.ts
    workspace.ts
  IntelligenceWorkspace.tsx
```

## Why this structure
This split keeps:
- spatial math separate from UI
- shared state separate from per-view rendering
- screen-family logic easier to maintain
- future coding-agent handoffs cleaner

---

# 8. How to think about each screen family

## 8.1 Flat Map
This is the **truth surface**.

It should answer:
- what objects exist
- where they are
- what the active extent is
- what geometry is selected

## 8.2 EO Overlay
This is the **exploitation surface**.

It should answer:
- what is being marked or measured
- what target boxes or aimpoints matter
- what the user is visually interrogating

## 8.3 Site 3D
This is the **site-context surface**.

It should answer:
- what the selected site feels like spatially
- where tasking sits locally
- how aimpoints or local annotations relate to the selected object

## 8.4 Theater 3D
This is the **mission geometry surface**.

It should answer:
- how rings, vectors, and tasking relate in spatial space
- how asset assignment is understood in an operational field

## 8.5 Ops Wall
This is the **command-monitoring surface**.

It should answer:
- what is happening now
- what is assigned
- what is urgent
- what is distributed across time, region, and monitoring panels

---

# 9. Interaction model

## 9.1 Selection
Selection is the most important interaction in the current prototype.

When a user selects an object, the system should reflect that selection across:
- dossier cards
- map or primary view
- detail pane
- compare state when relevant

## 9.2 Compare
Compare is currently lightweight, but important.

Pinned compared items should:
- remain recoverable
- remain visible in some form of compare context
- affect compare bbox logic
- inform framing when compare extent mode is active

## 9.3 Filtering
Filtering should narrow the visible set of objects without breaking the identity model of the objects that remain.

## 9.4 Mode switching
Changing screen-family mode should not destroy workspace continuity.

The selected object should stay selected.
The visible scope should stay meaningful.
The mode switch should feel like changing lenses, not leaving the system.

---

# 10. Current gaps

## 10.1 Monolithic implementation
The current workspace code is too large and should be broken apart.

## 10.2 Mode normalization
The five screen families exist, but they still need better normalization so they feel like one product family instead of five separate visual sketches.

## 10.3 Right detail pane refinement
The right-side pane should become more systematic and mode-aware while preserving continuity.

## 10.4 Shared legends and view-specific controls
Each mode should have clearer control logic while still feeling structurally related.

## 10.5 Better compare surfacing
Compare exists logically but can be made clearer visually.

## 10.6 Clearer evidence model
Evidence references are present in the prototype, but the project still needs a more explicit evidence-surface language.

---

# 11. What the next coding agent should preserve

A future agent should **not** redesign the concept from scratch.

They should preserve:
- field-archive visual identity
- geometry-first logic
- bbox framing
- compare behavior
- screen-family coverage
- one-object-many-surfaces interaction model

They may improve:
- architecture
- visual polish
- code organization
- control consistency
- mode-specific details

---

# 12. Suggested execution order for the next cycle

## Traditional Approach:
1. stabilize the current workspace code
2. finish incomplete or rough UI sections
3. extract utilities into helper files
4. split screen families into individual view components
5. normalize controls and detail pane behavior
6. test continuity across modes

## Innovative Approach:
1. preserve object continuity first
2. preserve spatial truth second
3. preserve screen-family distinctiveness third
4. polish only after the behavior spine is stable

---

# 13. Running / using the prototype

## Current expectation
This project is designed to run as a front-end React prototype.

A local setup should include:
- React app scaffold
- Tailwind-compatible styling environment
- framer-motion
- lucide-react
- shadcn/ui-compatible component imports

## Minimum expectation for use
A developer opening this project should be able to:
- run the workspace
- switch modes
- change selection
- toggle layers
- pin compared objects
- change extent mode
- inspect the detail panel

---

# 14. Known guardrails

Do not collapse this into:
- a generic analytics dashboard
- a standard consumer map
- a flashy sci-fi UI with weak logic
- a purely artistic composition detached from geometry

Do not remove:
- bbox logic
- screen-family structure
- compare state
- selection continuity
- geometry-derived rendering

---

# 15. Long-term direction

This prototype can later evolve into:
- a MapLibre or deck.gl-backed workspace
- a real GeoJSON feature-store architecture
- a multi-surface intelligence operations UI kit
- a more formal field-archive design system
- an extensible operational visualization framework

But that should happen in later cycles.

The current cycle is about making the existing prototype coherent and clean enough to continue.

---

# 16. What I should remember
- This project is a **field-archive geo-intelligence prototype**.
- The real product idea is **continuity across spatial viewing modes**.
- The most important behaviors are selection, compare, extent, and geometry truth.
- The next step is not conceptual reinvention. It is **completion, stabilization, and modularization**.
- Every future change should protect this core idea: **one object, many surfaces, one operational identity**.