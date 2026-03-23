import { FlatMapView, EOOverlayView, OpsWallView, Site3DView, Theater3DView } from "./workspace/SurfaceViews";
import { formatBBox } from "./workspace/geo";
import { WorkspaceShell } from "./workspace/WorkspaceShell";
import { useWorkspaceState } from "./workspace/useWorkspaceState";

export default function IntelligenceWorkspace() {
  const {
    features,
    visibleFeatures,
    selectedFeature,
    comparedFeatures,
    activeBBox,
    dossierCards,
    selectionAnchor,
    selectionProjection,
    selectionOblique,
    incidentFeatures,
    ringSizes,
    state,
    setSelectedId,
    setQuery,
    setComparedIds,
    setVisibleLayers,
    setExtentMode,
    setWorkspaceMode,
  } = useWorkspaceState();

  const surfaceProps = {
    features,
    visibleFeatures,
    comparedIds: state.comparedIds,
    selectedFeature,
    activeBBox,
    selectionAnchor,
    selectionProjection,
    selectionOblique,
    incidentFeatures,
    ringSizes,
    extentMode: state.extentMode,
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
      visibleLayers={state.visibleLayers}
      visibleFeaturesCount={visibleFeatures.length}
      activeBBox={formatBBox(activeBBox)}
      extentMode={state.extentMode}
      workspaceMode={state.workspaceMode}
      renderMainSurface={renderMainSurface}
      onQueryChange={setQuery}
      onToggleCompare={toggleCompare}
      onToggleLayer={toggleLayer}
      onSelectFeature={setSelectedId}
      onSetExtentMode={setExtentMode}
      onSetWorkspaceMode={setWorkspaceMode}
    />
  );
}
