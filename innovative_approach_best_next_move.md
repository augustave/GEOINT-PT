# Innovative Approach - Best Next Move

## Conclusion
The best next move is **not** to start by polishing screens.

The best next move is to build the **behavior spine** of the system first: the shared logic that makes map, dossier, timeline, evidence, and compare states behave as one operational surface.

That means the next phase should prioritize:
1. semantic data contracts
2. shared state orchestration
3. cross-surface selection synchronization
4. GeoJSON styling logic
5. only then the visual shell and screen-level polish

If you skip that order, the product may look right but feel fake.

---

## Traditional Approach:
A typical team would do this next:
- design more polished screens
- build a React layout
- add a map
- connect data later

That produces fast visuals, but it usually breaks the core promise of this system:
**the same object must feel continuous across every surface.**

In a normal dashboard, that continuity is optional.
In this product, it is the entire experience.

---

## Innovative Approach:
Build the system in terms of **operational continuity**, not page design.

The question is not:
- “What screen should we design next?”

The question is:
- “What logic must exist so that a selected incident, route, or zone feels like one living object across map, dossier, timeline, and evidence?”

That is the real next move.

---

# Phase 1 — Define the Shared Object Model

## Goal
Create one semantic contract for every geospatial object the system handles.

## Why this comes first
Without this layer, every component invents its own understanding of the data. Then selection, filtering, evidence linking, freshness, and comparison all become inconsistent.

## What to define
Every object should have a normalized shape that includes:
- identity
- geometry type
- entity type
- operational state
- priority
- confidence
- freshness
- source class
- primary label
- time window
- evidence references
- compare eligibility

## Output
A typed object contract such as:
- `FieldObject`
- `FeatureStyleContract`
- `EvidenceRef`
- `TimeState`

## Success condition
A point, line, zone, incident, or report can all be described in one coherent system language.

---

# Phase 2 — Build the State Spine

## Goal
Create the central shared state model that powers all surfaces.

## Why this matters
This is the layer that makes the system feel alive and unified.

## Shared state should include
- selected object ID
- hovered object ID
- compared object IDs
- active filters
- active time window
- visible layers
- focused evidence reference
- current map extent
- current detail pane target

## Output
A state architecture that can drive:
- map highlight
- card highlight
- timeline highlight
- detail pane expansion
- evidence callout emphasis

## Success condition
Selecting one object in any surface updates every other relevant surface without ambiguity.

---

# Phase 3 — Define Cross-Surface Behaviors

## Goal
Write the behavior rules that bind the system together.

## Core interactions to define

### 1. Selection Sync
If a user selects a feature on the map:
- the corresponding dossier card becomes selected
- the detail pane opens
- the timeline highlights related events
- evidence references become available

### 2. Reverse Selection
If a user selects a card or timeline item:
- the map centers or highlights the related feature
- the geometry receives halo/trace treatment
- related layers become legible if previously muted

### 3. Compare Mode
If a user pins objects:
- they enter the compare tray
- shared fields align automatically
- deltas are emphasized
- map view can frame them together

### 4. Evidence Trace
If a user selects an evidence reference:
- related geometry highlights
- related report excerpt opens
- provenance stays visible

## Output
An interaction rulebook, not just visual mockups.

## Success condition
The user can move through the system by following objects, not by hunting UI.

---

# Phase 4 — Build GeoJSON Style Logic

## Goal
Translate semantics into deterministic geospatial rendering rules.

## Why this matters
This is the bridge between the product language and the map engine.

## What to define
Map styling must be computed from:
- geometry type
- operational state
- priority
- confidence
- freshness
- source class
- selected / compared / filtered status

## Example logic
- critical active incident point → strong signal treatment
- stale observation point → muted treatment
- selected route → emphasized stroke + linked detail state
- low-priority zone → restrained fill + edge definition

## Output
A style resolution layer such as:
- `resolvePointStyle()`
- `resolveLineStyle()`
- `resolvePolygonStyle()`
- `resolveLabelVisibility()`

## Success condition
The map behaves like a system, not a hand-styled scene.

---

# Phase 5 — Build the Core Surfaces

## Goal
Only after the behavior spine exists, build the primary UI surfaces.

## Build in this order

### 1. IntelligenceWorkspace
This is the main proving ground.
It should include:
- TabRail
- FilterBand
- GeoCanvas
- DossierPane
- TimelineStrip or CompareTray

### 2. EntityDossier
This tests whether object continuity works in deeper inspection mode.

### 3. CompareView
This tests whether the system can reason across multiple objects at once.

## Success condition
The same selected object remains coherent across every surface.

---

# Phase 6 — Apply the Tactile Visual Layer

## Goal
Only now should the full archival visual character be added systematically.

## Why it comes later
The dossier materiality is a force multiplier, but if it arrives before the behavior spine, it can disguise structural weakness.

## What to apply now
- substrate tokens
- stack offsets
- tab cuts
- metadata strip styling
- evidence block treatments
- restrained motion
- signal color hierarchy

## Success condition
The system now feels both correct and distinctive.

---

# Recommended Build Sequence

## Traditional Build Sequence
1. tokens
2. components
3. screens
4. data wiring

## Better Sequence for This System
1. data contracts
2. state spine
3. cross-surface behavior rules
4. GeoJSON style logic
5. core surfaces
6. tactile visual layer
7. secondary templates

This is the safer and smarter order.

---

# Immediate Next Deliverables

## Deliverable 1
**Semantic Contracts Pack**
Includes:
- `FieldObject`
- `EvidenceRef`
- `FeatureStyleContract`
- `FilterState`
- `CompareState`

## Deliverable 2
**Interaction Spine Spec**
Defines:
- selection sync
- compare flow
- evidence trace flow
- map-to-record linking
- state propagation rules

## Deliverable 3
**Geo Style Engine Spec**
Defines:
- style resolution by feature type and state
- zoom rules
- label thresholds
- cluster logic

## Deliverable 4
**Core Workspace Prototype**
Implements:
- one real IntelligenceWorkspace shell
- one selected-object flow
- one compare flow
- one evidence trace flow

---

# Decision Rule
If forced to choose between:
- better visual polish
- better cross-surface continuity

Choose **cross-surface continuity** every time.

That is the part users will feel, trust, and remember.

---

# What I should remember
- The next step is not “more screens.”
- The next step is the **behavior spine**.
- The soul of the system is **object continuity across surfaces**.
- Build semantics and shared state before visual polish.
- The tactile dossier layer should amplify the system, not hide missing logic.

