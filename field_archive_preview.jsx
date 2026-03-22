import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Layers3, Clock3, AlertTriangle, Crosshair, FileText, Route, MapPinned, Filter, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const objects = [
  {
    id: "INC-0142",
    type: "incident",
    title: "Checkpoint Delta Event",
    subtitle: "Sensor ingest · Sector 07",
    priority: "high",
    confidence: "medium",
    freshness: "recent",
    status: "alert",
    region: "SECTOR-07",
    time: "14:32 UTC",
    summary: "Unusual activity clustered near the eastern boundary. Linked to two supporting evidence references.",
    evidence: ["IMG-044 Thermal frame", "SRC-201 Sensor burst"],
    x: 70,
    y: 35,
  },
  {
    id: "RTE-088",
    type: "route",
    title: "Corridor Ember 3",
    subtitle: "Derived analysis · East link",
    priority: "medium",
    confidence: "high",
    freshness: "recent",
    status: "active",
    region: "CORRIDOR-E3",
    time: "Updated 20m ago",
    summary: "High-confidence corridor connecting southern staging area to sector transition point.",
    evidence: ["RPT-087 Route reconstruction"],
    x: 38,
    y: 62,
  },
  {
    id: "ZON-021",
    type: "zone",
    title: "Search Area Amber",
    subtitle: "Manual entry · Review scope",
    priority: "medium",
    confidence: "medium",
    freshness: "aging",
    status: "selected",
    region: "ZONE-A21",
    time: "Window: 12:00–18:00 UTC",
    summary: "Bounded review zone with overlapping historical observations and one active corridor crossing.",
    evidence: ["DOC-014 Analyst note", "IMG-019 Aerial crop"],
    x: 28,
    y: 30,
  },
  {
    id: "STE-203",
    type: "site",
    title: "Depot North Marker",
    subtitle: "Historical archive · Site",
    priority: "low",
    confidence: "confirmed",
    freshness: "stale",
    status: "default",
    region: "SITE-N2",
    time: "Last verified 3d ago",
    summary: "Persistent site marker used as a comparison anchor across route and incident reviews.",
    evidence: ["SRC-044 Registry extract"],
    x: 22,
    y: 68,
  },
];

const layers = [
  { id: "zones", name: "Zones", active: true },
  { id: "routes", name: "Routes", active: true },
  { id: "incidents", name: "Incidents", active: true },
  { id: "sites", name: "Sites", active: false },
];

function statusClasses(status: string) {
  switch (status) {
    case "alert":
      return "border-orange-400/70 bg-orange-200/70 text-zinc-900";
    case "selected":
      return "border-yellow-500/70 bg-yellow-200/70 text-zinc-900";
    case "active":
      return "border-lime-500/70 bg-lime-200/70 text-zinc-900";
    case "default":
    default:
      return "border-zinc-700 bg-zinc-200/70 text-zinc-900";
  }
}

function pointClasses(type: string, selected: boolean, status: string) {
  const base = "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200";
  if (type === "incident") {
    return `${base} ${selected ? "h-6 w-6 border-orange-300 bg-orange-500 shadow-[0_0_0_6px_rgba(251,146,60,0.18)]" : "h-4 w-4 border-orange-200 bg-orange-400"}`;
  }
  if (type === "site") {
    return `${base} ${selected ? "h-5 w-5 border-cyan-200 bg-cyan-400 shadow-[0_0_0_6px_rgba(34,211,238,0.18)]" : "h-3.5 w-3.5 border-cyan-100 bg-cyan-300"}`;
  }
  if (status === "selected") {
    return `${base} h-5 w-5 border-yellow-200 bg-yellow-400 shadow-[0_0_0_7px_rgba(250,204,21,0.16)]`;
  }
  return `${base} h-4 w-4 border-zinc-100 bg-zinc-300`;
}

export default function FieldArchivePreview() {
  const [selectedId, setSelectedId] = useState("ZON-021");
  const [query, setQuery] = useState("");
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zones: true,
    routes: true,
    incidents: true,
    sites: false,
  });

  const filteredObjects = useMemo(() => {
    return objects.filter((item) => {
      const matchesQuery = !query || `${item.title} ${item.subtitle} ${item.id}`.toLowerCase().includes(query.toLowerCase());
      const layerMap: Record<string, string> = {
        incident: "incidents",
        route: "routes",
        zone: "zones",
        site: "sites",
      };
      const layerKey = layerMap[item.type];
      return matchesQuery && !!visibleLayers[layerKey];
    });
  }, [query, visibleLayers]);

  const selected = filteredObjects.find((item) => item.id === selectedId) || filteredObjects[0] || objects[0];

  return (
    <div className="min-h-screen bg-[#11120f] text-zinc-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1500px] rounded-[28px] border border-zinc-800 bg-[#161713] shadow-2xl overflow-hidden">
        <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[100px_330px_minmax(0,1fr)_360px]">
          <aside className="border-r border-zinc-800 bg-[#12130f] p-3 flex xl:flex-col gap-3 xl:gap-2">
            {[MapPinned, AlertTriangle, Route, FileText, Layers3].map((Icon, i) => (
              <button
                key={i}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${i === 0 ? "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]" : "border-zinc-800 bg-[#181914] text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"}`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
            <div className="hidden xl:block mt-auto rounded-2xl border border-zinc-800 bg-[#181914] p-3 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Field Archive
            </div>
          </aside>

          <aside className="border-r border-zinc-800 bg-[#181914] p-4 md:p-5">
            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Operational Index</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">Intelligence Workspace</div>
              <div className="mt-1 text-sm text-zinc-400">Cross-linked dossier, map, and evidence surface</div>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-[#11120f] px-3 py-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search IDs, routes, incidents"
                className="border-0 bg-transparent px-0 text-sm text-zinc-100 shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="mb-4 rounded-2xl border border-zinc-800 bg-[#13140f] p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-200"><Filter className="h-4 w-4 text-[#d1b16d]" /> Active Layers</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Live</div>
              </div>
              <div className="space-y-2">
                {layers.map((layer) => {
                  const active = visibleLayers[layer.id];
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setVisibleLayers((prev) => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${active ? "border-zinc-700 bg-[#1b1c16] text-zinc-100" : "border-zinc-900 bg-[#12130f] text-zinc-500"}`}
                    >
                      <span>{layer.name}</span>
                      {active ? <Eye className="h-4 w-4 text-[#ef8f45]" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 overflow-auto pr-1" style={{ maxHeight: "calc(100vh - 290px)" }}>
              {filteredObjects.map((item) => {
                const selectedCard = item.id === selected?.id;
                return (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-[22px] border p-4 text-left transition ${selectedCard ? "border-[#d1b16d] bg-[#232116] shadow-[0_0_0_1px_rgba(209,177,109,0.2)]" : "border-zinc-800 bg-[#141510] hover:border-zinc-700"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{item.id}</div>
                        <div className="mt-1 text-base font-medium text-zinc-100">{item.title}</div>
                        <div className="mt-1 text-sm text-zinc-400">{item.subtitle}</div>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${statusClasses(item.status)}`}>{item.status}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <span>{item.time}</span>
                      <span>{item.priority} priority</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </aside>

          <main className="relative bg-[#151611]">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Region Scope</div>
                <div className="mt-1 text-lg font-medium text-zinc-100">Eastern Sector Review</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-zinc-700 bg-[#191a14] text-zinc-200 hover:bg-[#20221a] hover:text-zinc-100">
                  <Clock3 className="mr-2 h-4 w-4" /> 12:00–18:00 UTC
                </Button>
                <Button variant="outline" className="border-zinc-700 bg-[#191a14] text-zinc-200 hover:bg-[#20221a] hover:text-zinc-100">
                  <Crosshair className="mr-2 h-4 w-4" /> Center Selection
                </Button>
              </div>
            </div>

            <div className="relative h-[calc(100vh-84px)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,120,90,0.10),rgba(10,10,10,0.4)_55%)]" />
              <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

              {visibleLayers.zones && (
                <div className="absolute left-[14%] top-[18%] h-[34%] w-[32%] rounded-[36px] border border-yellow-700/60 bg-yellow-500/10" />
              )}

              {visibleLayers.routes && (
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M22,68 C28,60 31,57 38,62 S55,66 61,56 74,36 82,29" fill="none" stroke="#ef8f45" strokeWidth="0.6" strokeLinecap="round" opacity="0.85" />
                  <path d="M16,44 C29,48 36,46 47,37 S67,25 78,19" fill="none" stroke="#f1c27d" strokeWidth="0.22" strokeDasharray="1.2 1.2" opacity="0.6" />
                </svg>
              )}

              {filteredObjects.map((item) => {
                const isSelected = item.id === selected?.id;
                if (item.type === "route") {
                  return (
                    <div
                      key={item.id}
                      className="absolute"
                      style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    >
                      <button
                        onClick={() => setSelectedId(item.id)}
                        className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${isSelected ? "border-[#ef8f45] bg-[#2f2014] text-[#f4ad76]" : "border-zinc-700 bg-[#161712] text-zinc-400"}`}
                      >
                        {item.id}
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={pointClasses(item.type, isSelected, item.status)}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    aria-label={item.title}
                  />
                );
              })}

              {selected && (
                <motion.div
                  layout
                  className="absolute left-6 top-6 max-w-xs rounded-[24px] border border-zinc-700/80 bg-[#171812]/95 p-4 shadow-2xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#d1b16d]" /> linked selection
                  </div>
                  <div className="mt-2 text-lg font-medium text-zinc-100">{selected.title}</div>
                  <div className="mt-1 text-sm text-zinc-400">{selected.subtitle}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${statusClasses(selected.status)}`}>{selected.status}</span>
                    <span className="rounded-full border border-zinc-700 bg-[#1f2019] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-300">{selected.confidence} confidence</span>
                    <span className="rounded-full border border-zinc-700 bg-[#1f2019] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-zinc-300">{selected.region}</span>
                  </div>
                </motion.div>
              )}

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Visible Objects", value: `${filteredObjects.length}`, note: "Current scope" },
                  { label: "Evidence Links", value: `${selected?.evidence.length ?? 0}`, note: "For selected object" },
                  { label: "Selection Sync", value: "Active", note: "Map · Dossier · Evidence" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-zinc-800 bg-[#171812]/90 text-zinc-100 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{stat.label}</div>
                      <div className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</div>
                      <div className="mt-1 text-sm text-zinc-400">{stat.note}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>

          <aside className="border-l border-zinc-800 bg-[#191a15] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Dossier Detail</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">{selected.title}</div>
              </div>
              <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${statusClasses(selected.status)}`}>{selected.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                ["ID", selected.id],
                ["Type", selected.type],
                ["Priority", selected.priority],
                ["Freshness", selected.freshness],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-zinc-800 bg-[#13140f] p-3">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
                  <div className="mt-2 text-sm font-medium text-zinc-100">{value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-zinc-800 bg-[#13140f] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Summary</div>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{selected.summary}</p>
            </div>

            <div className="mt-4 rounded-[24px] border border-zinc-800 bg-[#13140f] p-4">
              <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Evidence References</div>
              <div className="space-y-2">
                {selected.evidence.map((ref) => (
                  <button key={ref} className="w-full rounded-2xl border border-zinc-800 bg-[#181914] px-3 py-3 text-left transition hover:border-zinc-700">
                    <div className="text-sm text-zinc-100">{ref}</div>
                    <div className="mt-1 text-xs text-zinc-500">Linked to current map selection</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-zinc-800 bg-[#13140f] p-4">
              <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">Behavior Spine Preview</div>
              <div className="space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-zinc-800 bg-[#181914] p-3">Selection propagates across map marker, dossier card, and evidence panel.</div>
                <div className="rounded-2xl border border-zinc-800 bg-[#181914] p-3">Layer toggles update visible objects without breaking object identity.</div>
                <div className="rounded-2xl border border-zinc-800 bg-[#181914] p-3">Status, freshness, confidence, and region metadata stay consistent across surfaces.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
