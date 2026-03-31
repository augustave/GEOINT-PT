# GEOINT-PT

GEOINT-PT is a React and Vite prototype for a multi-surface geospatial intelligence workspace. The repository combines a branded landing page with a routed operational workspace that keeps one object, one extent, and one geometry model coherent across five distinct visual surfaces.

The current codebase is not just a visual mockup. It now includes a governed geometry layer, semantic design tokens, development-only QA surfaces, and automated checks intended to make visual drift harder to introduce.

<img width="1715" height="929" alt="Screenshot 2026-03-25 at 5 25 52 PM" src="https://github.com/user-attachments/assets/df0899dd-5cd8-40a9-afeb-f1cea5da42b7" />

## Project Thesis

Most geospatial products fail in one of two directions:

- they are data-rich but visually interchangeable
- they are visually dramatic but spatially untrustworthy

GEOINT-PT is trying to hold the middle ground:

- strong visual identity
- geometry-derived behavior
- persistent object continuity
- distinct surface roles without fragmenting the underlying state model

The system is organized around four invariants:

- `Selection`: the active object remains the same object across all surfaces
- `Compare`: pinned objects survive mode changes and stay available for contrast
- `BBox`: framing derives from geometry and current scope, not arbitrary screen placement
- `Dossier`: every surface stays connected to an intelligence-style review context

## Current State

The app currently exposes three routes:

- `/`: marketing homepage and product-story layer
- `/workspace`: primary intelligence workspace
- `/workspace/qa`: development-only surface QA dashboard

The workspace supports:

- free-text query filtering
- layer visibility toggles
- centralized selected-object state
- compare pinning for secondary objects
- extent switching between `operational`, `selection`, and `compare`
- a persistent dossier/detail context
- five distinct screen families with shared interaction behavior
- a shared geometry scene with ring, vector, and label contracts
- a development-only geometry debug overlay via `?debug=geometry`

## What Changed In This Iteration

The repository now includes a surface unification layer that moves core visual and geometric decisions out of ad hoc view code and into shared contracts.

New system capabilities include:

- semantic geometry tokens for reference blue, active amber, neutral muted, ring thickness, vector thickness, label offsets, and per-mode lighting
- per-mode `SurfaceConfig` definitions for lighting, camera, overlays, grid usage, and scene behavior
- shared geometry primitives for `Panel`, `Ring`, `Vector`, `Node`, and anchored labels
- a derived `GeometryScene` with:
  - `RingModel`
  - anchored vectors
  - anchored labels
  - integrity scoring
- a dev-only QA dashboard that renders all five surfaces side-by-side
- linting and automated tests that guard the geometry/rendering layer

## Screen Families

The workspace is intentionally organized into five different surfaces. They are meant to feel different, but not contradictory.

### 1. Flat Map

Primary role: geometry-truth surface

- renders points, lines, and polygons from the mock GeoJSON-like collection
- computes visible framing from the active bounding box
- acts as the strictest baseline for object position and extent truth
- keeps the selection ring and bbox-derived overlays tied to the shared scene

### 2. EO Overlay

Primary role: exploitation surface

- presents an imagery-inspired overhead composition
- adds target boxes, measurement cues, reference vectors, and selection markup
- uses the same anchor and color semantics as the other surfaces
- treats blue as reference and amber as active/selected

### 3. Site 3D

Primary role: local context surface

- uses a pseudo-oblique projection for site-level framing
- keeps local labels, markers, and ring cues snapped to projected geometry
- emphasizes local task-asset context rather than pure map review

### 4. Theater 3D

Primary role: mission geometry surface

- renders a shared fixed-step ring model
- renders anchored vectors instead of freehand lines
- exposes the scale proof directly in the view
- is the clearest expression of the shared mission geometry scene

### 5. Ops Wall

Primary role: supervisory surface

- presents a command-wall style aggregate view
- reuses the same mission geometry truth as theater mode
- frames the selected object inside a monitoring and synthesis surface
- is intentionally not a pure map

## Unified Geometry System

The current workspace no longer relies on view-specific geometry assumptions alone. The main geometry layer lives in [src/workspace/geo.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/geo.ts) and [src/workspace/types.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/types.ts).

### Core Concepts

- `SurfaceConfig`: per-mode lighting, camera, grid, overlays, and annotation density
- `RingModel`: center, count, step size, radii, and opacity falloff
- `AnchoredVector`: vectors with explicit start and end anchor kinds
- `AnchoredLabel`: labels snapped to node centers, vector midpoints, or ring tangents
- `GeometryScene`: the derived mission-geometry package used across surfaces
- `IntegrityScore`: per-category scoring plus violation reporting

### Geometry Rules

The current implementation enforces these ideas:

- rings derive from actual radii, not arbitrary visual circles
- vectors attach to explicit anchors such as:
  - nodes
  - ring intersections
  - bbox edges
- labels use tokenized offsets rather than eyeballed placement
- active/selected geometry uses amber semantics
- reference geometry uses blue semantics
- scene-specific rendering still preserves one underlying geometry model

### Integrity Score

The geometry scene produces an integrity score with category breakdowns for:

- anchors
- rings
- vectors
- labels
- color
- scale
- depth

The current thresholds are:

- `>= 98`: instrument-grade
- `95-97`: production-ready
- `90-94`: high quality but not locked
- `< 90`: needs correction

## Interaction Model

The workspace keeps a small centralized state model in [src/workspace/useWorkspaceState.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/useWorkspaceState.ts) and derives most visible behavior from it.

Shared state includes:

- `selectedId`
- `query`
- `comparedIds`
- `visibleLayers`
- `extentMode`
- `workspaceMode`

Derived state includes:

- visible features after query and layer filtering
- selected feature fallback behavior
- compare collections
- collection, selection, and compare bounding boxes
- the active bbox used for framing and projection
- dossier ordering by priority
- selected anchor points for flat and oblique views
- the shared `GeometryScene`

## Routing And Debug Views

### `/workspace`

This is the main operational route. It renders one active screen family inside the shared shell.

### `/workspace?debug=geometry`

In development, this enables the geometry debug overlay on the main workspace surface. The overlay shows:

- integrity summary
- score breakdown
- anchor markers
- rule violations

### `/workspace/qa`

This is a development-only QA route. It renders all five surface families side-by-side with:

- shared geometry score
- per-surface configuration context
- debug overlay active on every surface
- Playwright screenshot coverage

The route is excluded in production builds.

## Design Tokens And Styling

Semantic visual tokens live primarily in:

- [design_spec_package/css_variables.css](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/design_spec_package/css_variables.css)
- [tailwind.config.js](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/tailwind.config.js)

The token layer now covers:

- workspace surface backgrounds
- panel background and border
- geometry reference blue and active amber
- neutral geometry tones
- ring and vector stroke widths
- selection and reference glow behavior
- label contrast and offset tokens
- per-mode background lighting definitions

The styling goal is not generic theme consistency. It is semantic consistency:

- blue means reference
- amber means selected or active
- geometry stroke hierarchy is shared across modes
- panels remain readable regardless of mode lighting

## Governance And Quality Controls

The repo now includes explicit enforcement and verification layers.

### ESLint

[eslint.config.js](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/eslint.config.js) adds workspace-specific rules that:

- forbid raw SVG geometry elements inside workspace surface files
- forbid hard-coded geometry color literals in the geometry/rendering layer

The intent is to force new surface behavior through shared primitives instead of bypassing the system.

### Vitest

[src/workspace/geo.test.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/geo.test.ts) covers:

- fixed-step ring generation
- anchored vector generation
- tokenized label generation
- integrity-scene creation and score threshold behavior

### Playwright

[tests/workspace-qa.spec.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/tests/workspace-qa.spec.ts) captures a baseline screenshot for the dev QA route and ensures:

- the QA dashboard renders
- all surfaces mount
- the debug overlay is present

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- Lucide React
- Tailwind CSS
- ESLint
- Vitest
- Playwright

There is still no backend, persistence layer, real map engine, imagery pipeline, or true 3D terrain stack in the current prototype.

## Repository Structure

```text
.
├── src/
│   ├── App.tsx
│   ├── IntelligenceWorkspace.tsx
│   ├── MarketingHomepage.tsx
│   ├── index.css
│   ├── main.tsx
│   └── workspace/
│       ├── SurfaceViews.tsx
│       ├── WorkspaceQaPage.tsx
│       ├── WorkspaceShell.tsx
│       ├── cardPrimitives.tsx
│       ├── config.tsx
│       ├── geo.test.ts
│       ├── geo.ts
│       ├── geometryPrimitives.tsx
│       ├── mockData.ts
│       ├── styles.ts
│       ├── types.ts
│       └── useWorkspaceState.ts
├── design_spec_package/
│   ├── assets/
│   ├── brand_design_tokens.json
│   ├── css_variables.css
│   ├── layout_structure.json
│   └── optimized_copy_deck.json
├── tests/
│   ├── workspace-qa.spec.ts
│   └── workspace-qa.spec.ts-snapshots/
├── eslint.config.js
├── playwright.config.ts
├── vitest.config.ts
├── README.md
├── vercel.json
└── package.json
```

## Key Files

- [src/App.tsx](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/App.tsx): top-level router for marketing, workspace, and dev QA routing
- [src/IntelligenceWorkspace.tsx](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/IntelligenceWorkspace.tsx): workspace orchestration and surface prop assembly
- [src/workspace/useWorkspaceState.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/useWorkspaceState.ts): central derived state and geometry-scene creation
- [src/workspace/config.tsx](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/config.tsx): screen-family specs, semantic tokens, and `SurfaceConfig` definitions
- [src/workspace/geo.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/geo.ts): bbox math, projections, ring/vector/label derivation, and integrity scoring
- [src/workspace/geometryPrimitives.tsx](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/geometryPrimitives.tsx): shared geometry and debug rendering primitives
- [src/workspace/SurfaceViews.tsx](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/SurfaceViews.tsx): the five governed surface renderers
- [src/workspace/WorkspaceShell.tsx](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/WorkspaceShell.tsx): shell layout, controls, dossier framing, and mode switching
- [src/workspace/WorkspaceQaPage.tsx](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/WorkspaceQaPage.tsx): development-only QA dashboard
- [design_spec_package/css_variables.css](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/design_spec_package/css_variables.css): semantic CSS token source of truth

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install Dependencies

```bash
npm install
```

### Start The Development Server

```bash
npm run dev
```

The default Vite URL is typically `http://localhost:5173`.

### Run Lint

```bash
npm run lint
```

### Run Unit Tests

```bash
npm run test
```

### Run Visual QA

```bash
npm run test:visual
```

This uses Playwright and the `/workspace/qa` route.

### Build For Production

```bash
npm run build
```

This runs TypeScript checking with `tsc --noEmit` and then builds the Vite app.

### Preview The Production Build

```bash
npm run preview
```

## Deployment Notes

The repo includes [vercel.json](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/vercel.json) to preserve SPA fallback behavior. That matters because the app uses client-side routing for:

- `/`
- `/workspace`

The dev-only route `/workspace/qa` is guarded in the app router and is not exposed in production builds.

Any static host needs equivalent SPA fallback behavior for the production routes.

## How The Workspace Data Works

The current sample dataset in [src/workspace/mockData.ts](/Users/taoconrad/Dev/GitHub%204/GEOINT-PT/src/workspace/mockData.ts) uses a simplified GeoJSON-like shape:

- `type`
- `geometry`
- `properties`

Supported geometry types:

- `Point`
- `LineString`
- `Polygon`

Important property fields currently modeled:

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

If you replace the sample data, preserve this shape first and expand incrementally. The current workspace assumptions, selection flow, and geometry-scene derivation all depend on it.

## Development Guidance

When extending the prototype, preserve the current implementation order:

1. object continuity first
2. geometry truth second
3. screen-family distinctiveness third
4. visual polish after the first three remain intact

Good next steps:

- replace `mockData.ts` with a loader or API-backed source while preserving feature shape
- introduce a real map engine such as MapLibre or deck.gl for flat-map mode
- back EO mode with real image frames or tiled raster sources
- replace pseudo-oblique rendering with a real 3D scene stack if needed
- add persistence for selection history, compare sets, and session context
- connect integrity scoring to CI reporting if the repo moves beyond prototype status

## Current Limitations

This is still a prototype. It does not currently provide:

- authenticated access
- live intelligence feeds
- backend APIs
- multi-user workflows
- real map tiles or vector-tile rendering
- imagery ingestion
- terrain or globe rendering
- persistence across sessions
- production observability, audit logging, or hardened security controls

The current QA and governance layer improves local rigor, but it does not make the app an operational platform.

## Supporting Artifacts

The repository still includes several source artifacts from the earlier design and salvage process:

- `readme_intelligence_workspace.md`
- `prd_intelligence_workspace_screen_family_completion.md`
- `intelligence_workspace.jsx`
- `field_archive_preview.jsx`
- `geo_intelligence_core.ts`
- `semantic_contracts_pack.ts`

These remain useful as thesis and lineage documents, but the current implementation source of truth is the `src/` tree.

## License

No license file is currently present in this repository. Add one before distributing or open-sourcing the project beyond private or internal use.
