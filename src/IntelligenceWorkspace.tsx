import { useLocation } from "react-router-dom";
import { SURFACE_CONFIG_BY_MODE } from "./workspace/config";
import { FlatMapView, EOOverlayView, OpsWallView, Site3DView, Theater3DView } from "./workspace/SurfaceViews";
import { formatBBox } from "./workspace/geo";
import { WorkspaceShell } from "./workspace/WorkspaceShell";
import { useWorkspaceState } from "./workspace/useWorkspaceState";

export default function IntelligenceWorkspace() {
  const location = useLocation();
  const {
    selectedFeature,
    comparedFeatures,
    activeBBox,
    dossierCards,
    geometryScene,
    tasks,
    missionThreads,
    selectedTaskId,
    state,
    setSelectedId,
    setSelectedTaskId,
    setQuery,
    setComparedIds,
    setVisibleLayers,
    setExtentMode,
    setWorkspaceMode,
    createTask,
    assignTask,
    setTaskStatus,
    attachEvidence,
    attachCompare,
  } = useWorkspaceState();
  const debugGeometry = import.meta.env.DEV && new URLSearchParams(location.search).get("debug") === "geometry";

  const surfaceProps = {
    selectedFeature,
    geometryScene,
    surfaceConfig: SURFACE_CONFIG_BY_MODE[state.workspaceMode],
    debugGeometry,
    setSelectedId,
  };

  const renderMainSurface = () => {
    switch (state.workspaceMode) {
      case "eo-overlay":
        return <EOOverlayView {...surfaceProps} />;
      case "site-3d":
        return <Site3DView {...surfaceProps} />;
      case "theater-3d":
        return <Theater3DView {...surfaceProps} />;
      case "ops-wall":
        return <OpsWallView {...surfaceProps} />;
      default:
        return <FlatMapView {...surfaceProps} />;
    }
  };

  const toggleCompare = (id: string) => {
    setComparedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleLayer = (layerId: string) => {
    setVisibleLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  return (
    <WorkspaceShell
      query={state.query}
      selectedFeature={selectedFeature}
      comparedIds={state.comparedIds}
      comparedFeatures={comparedFeatures}
      dossierCards={dossierCards}
      tasks={tasks}
      missionThreads={missionThreads}
      selectedTaskId={selectedTaskId}
      visibleLayers={state.visibleLayers}
      visibleFeaturesCount={dossierCards.length}
      activeBBox={formatBBox(activeBBox)}
      extentMode={state.extentMode}
      workspaceMode={state.workspaceMode}
      renderMainSurface={renderMainSurface}
      onQueryChange={setQuery}
      onToggleCompare={toggleCompare}
      onToggleLayer={toggleLayer}
      onSelectFeature={setSelectedId}
      onSelectTask={setSelectedTaskId}
      onSetExtentMode={setExtentMode}
      onSetWorkspaceMode={setWorkspaceMode}
      onCreateTask={createTask}
      onAssignTask={assignTask}
      onSetTaskStatus={setTaskStatus}
      onAttachEvidence={attachEvidence}
      onAttachCompare={attachCompare}
    />
  );
}
