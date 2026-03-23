import { useMemo, useState } from "react";
import { entityLayer, featureMatchesQuery, computeFeatureBBox, mergeBBoxes, computeCollectionBBox, expandBBox, projectOblique, projectPoint } from "./geo";
import { createExampleCollection } from "./mockData";
import type { BBox, Feature, PointFeature, WorkspaceMode, ExtentMode, Position, WorkspaceState } from "./types";

const PRIORITY_RANK = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

export function isPointFeature(feature: Feature): feature is PointFeature {
  return feature.geometry.type === "Point";
}

export function useWorkspaceState() {
  const [features] = useState<Feature[]>(createExampleCollection());
  const [selectedId, setSelectedId] = useState("ZON-021");
  const [query, setQuery] = useState("");
  const [comparedIds, setComparedIds] = useState<string[]>(["STE-203"]);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zones: true,
    routes: true,
    incidents: true,
    sites: false,
  });
  const [extentMode, setExtentMode] = useState<ExtentMode>("operational");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("flat-map");

  const visibleFeatures = useMemo(() => {
    return features.filter((feature) => visibleLayers[entityLayer(feature.properties.entityType)] && featureMatchesQuery(feature, query));
  }, [features, query, visibleLayers]);

  const selectedFeature =
    visibleFeatures.find((feature) => feature.properties.id === selectedId) ||
    features.find((feature) => feature.properties.id === selectedId) ||
    features[0];

  const selectedBBox = computeFeatureBBox(selectedFeature);
  const comparedFeatures = comparedIds
    .map((id) => features.find((feature) => feature.properties.id === id))
    .filter((feature): feature is Feature => Boolean(feature));
  const compareBBox = comparedFeatures.reduce<BBox | undefined>((acc, feature) => mergeBBoxes(acc, computeFeatureBBox(feature)), undefined);
  const operationalBBox = computeCollectionBBox(visibleFeatures.length ? visibleFeatures : features);
  const activeBBox = useMemo(() => {
    const chosen =
      extentMode === "selection"
        ? selectedBBox
        : extentMode === "compare"
          ? compareBBox ?? selectedBBox
          : operationalBBox ?? selectedBBox;
    return expandBBox(chosen);
  }, [compareBBox, extentMode, operationalBBox, selectedBBox]);

  const dossierCards = useMemo(() => {
    return [...visibleFeatures].sort((a, b) => PRIORITY_RANK[b.properties.priority] - PRIORITY_RANK[a.properties.priority]);
  }, [visibleFeatures]);

  const selectionAnchor: Position =
    selectedFeature.geometry.type === "Point"
      ? selectedFeature.geometry.coordinates
      : selectedFeature.geometry.type === "LineString"
        ? selectedFeature.geometry.coordinates[Math.floor(selectedFeature.geometry.coordinates.length / 2)]
        : selectedFeature.geometry.coordinates[0][0];

  const selectionProjection = projectPoint(selectionAnchor, activeBBox);
  const selectionOblique = projectOblique(selectionAnchor, activeBBox);
  const incidentFeatures = visibleFeatures.filter(
    (feature): feature is PointFeature =>
      isPointFeature(feature) && (feature.properties.entityType === "incident" || feature.properties.entityType === "site")
  );
  const ringSizes = [10, 18, 28, 38, 52];

  const state: WorkspaceState = {
    selectedId,
    query,
    comparedIds,
    visibleLayers,
    extentMode,
    workspaceMode,
  };

  return {
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
  };
}
