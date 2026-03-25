# GEOINT-PT

GEOINT-PT is a React and Vite prototype for a multi-surface geospatial intelligence workspace. The repository combines a marketing-style landing page with a routed intelligence workspace that demonstrates how one operational object can preserve identity across multiple visual surfaces without discarding geometry-driven behavior.

This project is best understood as a working design-and-code prototype, not a production application. It is intended to explore a field-archive interface language, shared object continuity, and spatial truth across map, EO-style, pseudo-3D, and command-wall views.

<img width="1715" height="929" alt="Screenshot 2026-03-25 at 5 25 52 PM" src="https://github.com/user-attachments/assets/df0899dd-5cd8-40a9-afeb-f1cea5da42b7" />

## Project Thesis

Most geospatial products break down in one of two ways:

- they are data-rich but visually generic
- they are visually expressive but spatially untrustworthy

GEOINT-PT aims to sit between those extremes.

The current prototype is built around four core invariants:

- `Selection`: the active object should remain the same object across all surfaces
- `Compare`: pinned objects should survive mode changes and remain available for contrast
- `BBox`: framing should derive from geometry and current scope, not arbitrary screen placement
- `Dossier`: each view should remain connected to an intelligence-style detail and review model

## What Is in the App Today

The app currently exposes two routed experiences:

- `/`: a marketing-style homepage that presents the product story, proof points, and screen-family framing
- `/workspace`: the intelligence workspace prototype

The workspace currently supports:

- free-text query filtering
- layer visibility toggles
- centralized selected-object state
- compare pinning for secondary objects
- extent switching between operational, selection, and compare scopes
- a right-side dossier/detail context
- five distinct screen families with shared interaction behavior

## Screen Families

The workspace is organized around five surface types. They are intentionally different in visual language, but they share the same behavior spine.

### 1. Flat Map

Primary role: geometry-truth surface

- renders points, lines, and polygons from mock GeoJSON-like features
- computes view framing from the active bounding box
- highlights selection and compare state
- acts as the most review-heavy, geometry-led representation

### 2. EO Overlay

Primary role: exploitation surface

- presents an imagery-inspired overhead composition
- adds markup, target boxes, directional cues, and measurement references
- keeps the selected object linked back to the same shared workspace state

### 3. Site 3D

Primary role: local context surface

- uses a pseudo-oblique projection for site-level context
- keeps selected-object framing visible
- preserves local task and object continuity

### 4. Theater 3D

Primary role: mission geometry surface

- renders range rings, vectors, and broader operational relationships
- uses oblique projection helpers rather than arbitrary placement
- emphasizes tasking and theater-scale context

### 5. Ops Wall

Primary role: supervisory surface

- presents a command-wall style layout
- frames the current selected mission object in an aggregate operational view
- is designed as a monitoring and synthesis surface rather than a pure map

## Interaction Model

The current implementation keeps a small centralized state model and derives most visible behavior from it.

Shared state includes:

- `selectedId`
- `query`
- `comparedIds`
- `visibleLayers`
- `extentMode`
- `workspaceMode`

From that state, the workspace derives:

- visible features after query and layer filtering
- selected feature fallback behavior
- compare collections
- collection, selection, and compare bounding boxes
- the active bbox used for framing and projection
- dossier ordering by priority
- projected anchor points for flat and oblique surfaces

## Geometry and Spatial Logic

The prototype intentionally keeps core spatial helpers in the codebase so the UI remains tied to real geometric reasoning.

Current helpers include:

- feature and collection bounding box calculation
- bbox merging and padding
- flat 2D projection into SVG/screen percentages
- oblique projection for pseudo-3D surfaces
- SVG path generation for lines and polygons
- geodesic destination-point math
- sampled-circle generation for ring geometry

This matters because the project is explicitly trying to avoid a common failure mode in speculative geospatial UI work: making the product look operational while placing features arbitrarily.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Framer Motion
- Lucide React
- Tailwind CSS utility styling

There is no backend, persistence layer, map engine, imagery pipeline, or real 3D terrain integration in the current prototype.

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
│       ├── WorkspaceShell.tsx
│       ├── SurfaceViews.tsx
│       ├── cardPrimitives.tsx
│       ├── config.tsx
│       ├── geo.ts
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
├── README.md
├── readme_intelligence_workspace.md
├── prd_intelligence_workspace_screen_family_completion.md
├── intelligence_workspace.jsx
├── field_archive_preview.jsx
├── geo_intelligence_core.ts
└── semantic_contracts_pack.ts
```

### Key Files

- `src/App.tsx`: top-level router for the landing page and workspace route
- `src/MarketingHomepage.tsx`: branded homepage and product narrative layer
- `src/IntelligenceWorkspace.tsx`: workspace orchestration and surface switching
- `src/workspace/useWorkspaceState.ts`: central derived state and interaction spine
- `src/workspace/WorkspaceShell.tsx`: shell layout, controls, and dossier framing
- `src/workspace/SurfaceViews.tsx`: the five main surface renderers
- `src/workspace/geo.ts`: bbox, projection, and geometry helpers
- `src/workspace/mockData.ts`: example feature collection used by the prototype
- `design_spec_package/`: design tokens, copy, assets, and spec materials used by the landing experience

## Prototype Inputs and Supporting Artifacts

This repository still includes several source artifacts from the design and salvage process. They are useful context when extending the project:

- `readme_intelligence_workspace.md`: a longer narrative brief describing the product thesis and workspace principles
- `prd_intelligence_workspace_screen_family_completion.md`: implementation-oriented handoff for restoring and modularizing the workspace
- `intelligence_workspace.jsx`: original large prototype artifact
- `field_archive_preview.jsx`: prior field-archive style reference
- `geo_intelligence_core.ts`: earlier geo/math logic source material
- `semantic_contracts_pack.ts`: semantic/state concepts that informed the workspace model

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

The Vite dev server will print the local URL, typically `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

This runs TypeScript checking with `tsc --noEmit` and then produces a Vite production build.

### Preview the Production Build

```bash
npm run preview
```

## Deployment Notes

The repository includes a `vercel.json` rewrite that routes all requests to `index.html`. That is necessary because the app uses client-side routing for:

- `/`
- `/workspace`

Any static host used for deployment needs equivalent SPA fallback behavior.

## How the Workspace Data Works

The current feature collection uses simplified GeoJSON-style objects with:

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

If you want to replace the sample data with a richer dataset, the safest first step is to preserve this shape and expand incrementally rather than rewriting the workspace assumptions all at once.

## Extending the Prototype

Reasonable next steps for the repository:

- replace `mockData.ts` with a loader or API-backed source while preserving the current feature shape
- introduce a real map engine such as MapLibre or deck.gl for the flat-map surface
- back the EO surface with real image frames or tiled raster sources
- replace pseudo-oblique rendering with a proper 3D scene stack if the product direction warrants it
- add persistence for selection history, compare sets, and session context
- formalize the design tokens and component system shared by the landing page and workspace shell

When extending the project, preserve the existing behavior order:

1. object continuity first
2. geometry truth second
3. screen-family distinctiveness third
4. visual polish after the first three remain intact

## Current Limitations

This repository is still a prototype. It does not currently provide:

- authenticated access
- live intelligence feeds
- backend APIs
- multi-user workflows
- real map tiles or vector-tile rendering
- imagery ingestion
- terrain or globe rendering
- persistence across sessions
- production hardening, observability, or security controls

## Development Notes

- The workspace route is the main implementation artifact for behavior testing.
- The landing page is a product-story layer, not the core application.
- The current data is intentionally small and hand-authored to make behavior validation easy.
- The prototype is strongest when treated as a systems and interaction reference, not as a finished operational platform.

## License

No license file is currently present in this repository. Add one before distributing or open-sourcing the project beyond private/internal use.
