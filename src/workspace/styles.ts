export const PANEL_BASE = "bg-panel-bg backdrop-blur-panel border border-panel-border";

export const CLS = {
  narrativeCard: `min-w-0 rounded-[24px] ${PANEL_BASE} p-6 shadow-2xl`,
  proofCard: `min-w-0 rounded-[22px] ${PANEL_BASE} p-5 shadow-2xl`,
  surfaceCard: `min-w-0 rounded-[22px] ${PANEL_BASE} p-5`,
  surfaceOverlayCard: `rounded-[12px] ${PANEL_BASE} px-3 py-2`,
  objectCardBase: "min-w-0 rounded-lg border p-3 transition cursor-pointer",
  objectCardSelected: "min-w-0 rounded-lg border border-geometry-active bg-[color:rgba(42,29,18,0.92)] backdrop-blur-md p-3 shadow-[0_0_0_1px_var(--geometry-selection-glow)] transition cursor-pointer",
  objectCardDefault: `min-w-0 rounded-lg border border-zinc-800/50 bg-[#141510]/80 backdrop-blur-sm p-3 transition cursor-pointer hover:border-zinc-700`,
  dossierCard: `min-w-0 rounded-xl ${PANEL_BASE} p-4`,
  dossierSection: "min-w-0 rounded-lg border border-zinc-800/60 bg-[#181914]/80 p-3",
  compareCard: "min-w-0 rounded-lg border border-zinc-800/60 bg-[#181914]/80 px-2.5 py-2",
  meta: "text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium",
  surfaceMeta: "text-[10px] uppercase tracking-[0.2em] text-zinc-500",
  surfaceTitle: "mt-1 text-sm font-medium text-zinc-100",
  iconChip: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
  pill: "shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] transition",
  pillActive: "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]",
  pillDefault: "border-zinc-700 bg-[#1b1c16] text-zinc-300 hover:border-zinc-500",
  statusBarCard: `min-w-[110px] flex-1 rounded-lg ${PANEL_BASE} p-2`,
} as const;
