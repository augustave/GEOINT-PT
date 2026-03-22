# PRD — Intelligence Workspace Screen Family Completion

## Conclusion
This PRD is a handoff document for a coding agent to complete the current cycle of the **Intelligence Workspace** prototype without relying on prior conversation history.

The immediate objective is to salvage and stabilize the current prototype, restore the missing workspace shell, and turn the existing monolithic preview into a cleaner multi-file React implementation that preserves behavior continuity across all screen families.

The current workspace already demonstrates:
- a field-archive design language
- GeoJSON-style feature objects
- bbox-driven extent logic
- screen family switching
- compare and selection state
- multiple operational display modes

What remains is not concept discovery. What remains is repair, reconstruction, and disciplined modularization.

---

## Traditional Approach
Treat this as a **frontend completion and stabilization task** with five priorities:

1. restore the current truncated workspace so it compiles again
2. reconstruct the missing shell tail and right-hand detail rail
3. re-establish shared behavior continuity across all surfaces
4. extract reusable helpers and screen-family components incrementally
5. preserve working geometry-driven behavior while cleaning the architecture

## Innovative Approach
Treat this as the completion of a **visual operating language for intelligence-style geospatial products**.

The goal is not to make disconnected screens look polished.
The goal is to ensure that:
- one object preserves identity across all surfaces
- map truth remains geometry-driven
- 2D, EO, 3D, and wall displays feel like one system
- the product behaves like a field-archive intelligence environment

The implementation order must reflect that:
1. preserve object continuity first
2. preserve geometry truth second
3. preserve screen-family distinctiveness third
4. only then polish visual details

---

# 1. Product Context

## 1.1 Working Title
**Intelligence Workspace**

## 1.2 Product Thesis
A geo-intelligence interface system that combines:
- dossier-style operational UI
- GeoJSON-native map logic
- multiple spatial viewing modes
- intelligence workflow continuity across surfaces

## 1.3 Current Active Artifact
The current primary canvas artifact is:
- `intelligence_workspace.jsx`

This file should be treated as a prototype source to salvage and extract from, not as the final maintainable architecture.

Supporting source material that should inform the next cycle:
- `field_archive_preview.jsx` for a completed dossier/detail-pane pattern and evidence block structure
- `geo_intelligence_core.ts` for geo math, bbox, geodesic ring, and geometry-truth logic
- `semantic_contracts_pack.ts` for semantic contracts, workspace-state concepts, and dossier projection helpers

---

# 2. Current State Summary

## 2.1 What is already present
The existing workspace prototype already includes:
- typed feature objects inside the JSX artifact
- point / line / polygon geometry handling
- bbox computation
- collection / selection / compare extent logic
- flat 2D map mode
- EO overlay mode
- site 3D mode
- theater 3D mode
- ops wall mode
- left navigation rail
- middle control/index rail
- query filtering
- visible layer toggles
- compare toggles
- extent mode switching state
- screen family switching state

The screen family set is already identified and implemented in prototype form:
- `flat-map`
- `eo-overlay`
- `site-3d`
- `theater-3d`
- `ops-wall`

## 2.2 What is currently wrong or unfinished
The build cycle was interrupted by a hard truncation in the main workspace file. The primary issues are:
- `intelligence_workspace.jsx` is cut off mid-JSX near the extent-mode controls
- the workspace shell tail after the extent controls is missing
- the main layout does not currently reach a completed right-hand detail pane
- the current implementation is too large to maintain safely in one file
- some screen-family treatments are conceptually correct but still need structural cleanup
- top-bar and utility behavior need consistency checks across modes

This is more severe than “rough finish quality.” The next agent must first restore a syntactically complete workspace before evaluating polish or refactor completeness.

## 2.3 Best reconstruction source
The best local source for rebuilding the missing dossier/detail rail is:
- `field_archive_preview.jsx`

That file already contains:
- a completed right-hand dossier layout
- evidence reference blocks
- summary cards
- behavior-spine messaging that maps well to the workspace concept

The next agent should borrow structure and interaction patterns from that file rather than inventing a new right rail from scratch.

---

# 3. Problem Statement

The current prototype proves the product direction, but it is not yet a stable handoff-quality skeleton.

A follow-on coding agent must transform the current interrupted preview into a **coherent multi-view intelligence workspace** where:
- every screen family feels intentional
- shared data and selection state remain continuous
- the display modes are visually distinct but behaviorally unified
- the codebase becomes modular and maintainable

The immediate obstacle is restoration of the truncated workspace. Until that is repaired, the prototype cannot be treated as complete or safely extendable.

---

# 4. Goal of This Cycle

Complete and stabilize the current **screen-family expansion** for the Intelligence Workspace.

This cycle includes:
- restoring the truncated `intelligence_workspace.jsx` shell
- rebuilding the right-hand detail/dossier rail
- re-establishing a clean single-file working prototype first
- modularizing view and helper logic incrementally after stability is restored
- keeping all rendering truth geometry-driven in flat-map mode
- preserving the field-archive visual language

This cycle does **not** require a greenfield rewrite.

---

# 5. Scope

## 5.1 In Scope
- repair and complete the current `intelligence_workspace.jsx` cycle
- preserve and refine the following modes:
  - flat-map
  - eo-overlay
  - site-3d
  - theater-3d
  - ops-wall
- complete the missing right-side dossier/detail pane
- complete the workspace shell after the extent-mode controls
- normalize top bar, action strips, and utility controls where needed
- split the large component into smaller subcomponents after stability is restored
- preserve shared state for:
  - selected feature
  - compared items
  - visible layers
  - extent mode
  - workspace mode
  - query filtering
- preserve bbox-driven and projection-driven logic
- preserve sampled ring / geodesic overlay behavior
- preserve the field-archive aesthetic

## 5.2 Out of Scope
- live backend integration
- real map engine integration with MapLibre or deck.gl
- real imagery ingestion
- real 3D terrain engine
- auth, permissions, routing, persistence
- production-grade performance optimization
- full JSX to TSX migration

---

# 6. User Experience Requirements

## 6.1 Shared UX requirement
A selected feature must feel like the same object across:
- list/index pane
- main viewing surface
- compare tray or compare controls
- right detail pane

## 6.2 Screen family requirements

### A. Flat Map
Purpose:
- 2D operational truth view
- feature filtering and bbox fit
- geometry legibility

Must show:
- points
- lines
- polygons
- selection highlight
- compare state
- bbox-driven framing

Must remain geometry-driven:
- no arbitrary screen positioning in place of projected geometry
- no removal of bbox logic for convenience

### B. EO Overlay
Purpose:
- overhead exploitation interface
- aimpoint / markup / mensuration style view

Must show:
- image-like overhead substrate
- colored target boxes or markup overlays
- distance or measurement cues
- directional cues
- selected object linkage back to dossier state

### C. Site 3D
Purpose:
- local oblique scene for site-level tasking

Must show:
- oblique projection feel
- labeled target markers
- selected-site context
- task and aimpoint framing

### D. Theater 3D
Purpose:
- flight / route / ring / tasking overview

Must show:
- ring geometry
- line-of-task or route vectors
- object labels in spatial field
- task-asset framing

### E. Ops Wall
Purpose:
- command-center composite display

Must show:
- multi-panel wall logic
- mission clocks
- central monitoring surface
- side analytics panels
- command and monitoring density

---

# 7. Functional Requirements

## 7.1 Data model
The implementation should continue using the existing local feature model for this cycle.

Minimum supported geometry:
- Point
- LineString
- Polygon

Minimum supported properties:
- id
- entityType
- labelPrimary
- labelSecondary
- operationalState
- priority
- confidence
- freshness
- sourceClass
- regionCode
- evidenceRefs
- summary
- timeLabel

## 7.2 Centralized workspace state
No new external product API is required for this cycle.

The following state must remain centralized at workspace level:
- `selectedId`
- `query`
- `comparedIds`
- `visibleLayers`
- `extentMode`
- `workspaceMode`

## 7.3 Derived logic
The implementation must preserve:
- filtered visible feature list
- selected feature lookup
- selected bbox
- compare bbox
- collection bbox
- active bbox resolution
- projected anchor positions for flat and oblique views

## 7.4 Internal module expectations
The next agent should extract internal modules for:
- geo math and bbox logic
- projection helpers
- feature style resolution
- mock data
- dossier/detail-pane rendering
- one component per screen family

---

# 8. Technical Requirements

## 8.1 Required refactor rule
The next agent should refactor incrementally, not rewrite conceptually.

Required order:
1. restore a compiling single-file `intelligence_workspace.jsx`
2. re-establish shared behavior continuity
3. extract reusable helpers
4. extract each screen family into a separate component
5. normalize controls and detail-pane behavior across families

Do not begin by redesigning the product from the docs alone.

## 8.2 Recommended structure

```text
intelligence_workspace.jsx
components/
  WorkspaceNavRail.jsx
  WorkspaceControlPane.jsx
  WorkspaceHeader.jsx
  WorkspaceDetailPane.jsx
  CompareTray.jsx
views/
  FlatMapView.jsx
  EOOverlayView.jsx
  Site3DView.jsx
  Theater3DView.jsx
  OpsWallView.jsx
lib/
  geoMath.ts
  projections.ts
  bbox.ts
  featureStyles.ts
  mockData.ts
```

The exact file names may vary if the target app scaffold requires it, but the separation of concerns should match this shape.

## 8.3 Type and language guidance
For this cycle:
- keep the workspace UI in JSX
- reuse the existing TypeScript helper files as the typed logic layer where useful
- treat `geo_intelligence_core.ts` and `semantic_contracts_pack.ts` as source material to extract from, not mandatory drop-in modules

Full TSX migration is out of scope for this completion pass.

## 8.4 Design system rule
Use the existing field-archive aesthetic:
- dark operational base
- restrained yellow and amber tasking accents
- dossier-like panels
- sparse tactical highlights
- dense but controlled information layout

Do not flatten all modes into one generic dashboard look.

---

# 9. Deliverables

## 9.1 Primary deliverable
A cleaned, working multi-file React prototype that fully restores and completes the current cycle.

## 9.2 Required deliverables
1. Restored `intelligence_workspace.jsx` shell that compiles cleanly
2. Reconstructed right-hand detail/dossier pane
3. Extracted screen-family view components
4. Extracted geo helper utilities
5. Completed screen mode switching
6. Working compare toggles
7. Working extent mode switching
8. Consistent top bar and utility controls across modes

## 9.3 Nice-to-have deliverables
- lightweight mini compare summary in detail pane
- view-specific legend blocks
- mode-specific status chips
- stronger simulated EO substrate
- cleaner ops-wall analytics cards

---

# 10. Acceptance Criteria

A coding agent is done when all of the following are true:

## 10.1 Stability
- the restored workspace compiles cleanly
- no incomplete JSX remains
- no broken branches remain in the render logic
- the shell continues past the extent-mode controls into a complete layout

## 10.2 Behavior
- selection updates all relevant surfaces
- compare state works from dossier cards or dossier controls
- extent mode actually changes the framing logic
- switching screen families preserves selected object state
- compare and extent controls survive the refactor intact

## 10.3 Coverage
- all 5 modes render intentionally, not as placeholder blanks
- the right detail pane exists again and works across modes
- the control pane remains usable across modes
- the restored right rail exposes summary and evidence information for the current selection

## 10.4 Geometry truth
- flat-map rendering remains bbox-driven and projection-driven
- geometry truth is not replaced with arbitrary hard-coded screen placement
- ring and route behavior remain spatially derived

## 10.5 Architecture
- the giant monolith is broken into smaller readable pieces
- shared utilities are moved out of view components where reasonable
- the result is small enough for a future agent to continue without context overflow

---

# 11. Verification Plan

The next agent should explicitly verify:
- compile/readability: the restored workspace file is syntactically complete and no JSX branch is cut off
- mode continuity: switching among all five screen families preserves selection and does not reset compare state
- extent behavior: `operational`, `selection`, and `compare` modes produce distinct framing behavior from shared bbox logic
- dossier continuity: selecting from the index or surface updates the right detail pane, summary fields, and evidence list consistently
- compare behavior: pin and unpin behavior remains visible after mode switches
- geometry truth: flat-map rendering still derives layout from geometry projection and bbox math
- screen-family distinctiveness: EO, site 3D, theater 3D, and ops wall remain visually differentiated rather than collapsing into a generic dashboard

---

# 12. Non-Goals and Guardrails

## 12.1 Non-goals
Do not spend time on:
- production API wiring
- perfect realism
- exact recreation of reference software
- backend or persistence
- advanced optimization
- full TypeScript component migration

## 12.2 Guardrails
- do not flatten all modes into one generic dashboard look
- do not lose the field-archive intelligence aesthetic
- do not replace geometry-driven logic with arbitrary screen positioning in flat-map mode
- do not remove bbox logic
- do not remove compare behavior
- do not overdecorate the screens with unnecessary visual noise
- do not rebuild from documentation alone when salvage of the current prototype is possible

---

# 13. Design Intent to Preserve

The prototype should feel like:
- a field dossier
- a tactical interface
- a map intelligence instrument
- a command and analysis environment

It should not feel like:
- generic SaaS analytics
- consumer map software
- glossy sci-fi UI for its own sake
- an artboard with disconnected mock screens

---

# 14. Immediate Suggested Execution Order

## Traditional Approach
1. restore the truncated `intelligence_workspace.jsx` to a compiling single-file state
2. reconstruct the right-hand detail pane using `field_archive_preview.jsx` as the primary local reference
3. confirm selection, compare, and extent continuity in the restored shell
4. extract geo and projection helpers using the existing TypeScript files as source material
5. extract each screen family into separate components
6. normalize controls, top bar behavior, and detail-pane consistency across modes
7. verify all five modes still preserve shared object identity

## Innovative Approach
1. preserve object continuity first
2. preserve geometry truth second
3. preserve screen-family distinctiveness third
4. only then polish visual details

These are implementation requirements, not just design aspirations.

---

# 15. Handoff Notes for the Next Coding Agent

The current cycle stopped because the main workspace artifact became too large and was then cut off mid-render.

You should assume:
- the concept direction is approved
- the five screen families are already correctly identified
- the gap is restoration and stabilization, not product redefinition
- the next cycle should salvage the current prototype rather than recreate it from scratch

Work from the current `intelligence_workspace.jsx` as a prototype reference, rebuild the missing shell, then produce a smaller, cleaner architecture.

Use:
- `field_archive_preview.jsx` as the strongest local reference for dossier/detail-pane reconstruction
- `geo_intelligence_core.ts` as the strongest local reference for geo math and geometry-truth logic
- `semantic_contracts_pack.ts` as the strongest local reference for semantic and projection-adjacent state contracts

---

# 16. Assumptions

The next agent should assume:
- this PRD was revised in place and is the canonical handoff document for the cycle
- the current prototype should be salvaged rather than rebuilt from documentation alone
- the right-pane reconstruction should borrow structure from `field_archive_preview.jsx`
- the existing TypeScript helper files are source material to reuse, not mandatory drop-in modules as-is
- this cycle ends at a working, modular prototype skeleton rather than production integration or full TSX migration

---

# 17. What To Remember

- This is a **completion PRD**, not a fresh concept brief.
- The main goal is to finish the interrupted cycle without losing the behavior spine.
- The missing gap is **prototype reconstruction and stabilization**, especially the truncated workspace shell and right rail.
- The next agent must preserve selection sync, bbox logic, compare logic, and the field-archive aesthetic.
- Success means the prototype becomes **working, modular, and safe to extend** in the next cycle.
