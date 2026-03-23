# Intelligence Workspace

Multi-view geo-intelligence workspace prototype built around:
- field-archive interface language
- geometry-driven spatial logic
- shared selection, compare, and extent state
- five screen families:
  - flat map
  - EO overlay
  - site 3D
  - theater 3D
  - ops wall

## What Runs Now

The repository now includes a runnable Vite + React application that exposes:
- screen-family switching
- search and layer filtering
- centralized selection state
- compare pinning
- extent mode switching
- right-side dossier/detail pane

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Repository Notes

- The original prototype artifacts and planning docs remain in the repo as source material.
- The main app entrypoint is `src/IntelligenceWorkspace.tsx`.
- The detailed project brief that drove this implementation still exists in `readme_intelligence_workspace.md`.
