import { useMemo, useState } from "react";
import { buildGeometryScene, computeCollectionBBox, computeFeatureBBox, entityLayer, expandBBox, featureMatchesQuery, mergeBBoxes } from "./geo";
import { createExampleCollection } from "./mockData";
import { buildMissionThreads, createTaskFromObject } from "./tasking";
import type { BBox, CreateTaskInput, ExtentMode, Feature, PointFeature, TaskModel, TaskStatus, WorkspaceMode, WorkspaceState } from "./types";

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
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

  const incidentFeatures = visibleFeatures.filter(
    (feature): feature is PointFeature =>
      isPointFeature(feature) && (feature.properties.entityType === "incident" || feature.properties.entityType === "site")
  );
  const geometryScene = useMemo(
    () =>
      buildGeometryScene({
        selectedFeature,
        visibleFeatures: visibleFeatures.length ? visibleFeatures : features,
        comparedIds,
        bbox: activeBBox,
        bboxSource: extentMode,
      }),
    [activeBBox, comparedIds, extentMode, features, selectedFeature, visibleFeatures]
  );
  const missionThreads = useMemo(() => buildMissionThreads(tasks), [tasks]);

  const createTask = (taskInput: CreateTaskInput) => {
    if (!selectedFeature) {
      return null;
    }

    const task = createTaskFromObject({
      input: taskInput,
      sourceFeature: selectedFeature,
      bboxSnapshot: geometryScene.bbox,
      surfaceOrigin: workspaceMode,
    });

    setTasks((prev) => [task, ...prev]);
    setSelectedTaskId(task.id);
    return task;
  };

  const updateTask = (taskId: string, patch: Partial<Omit<TaskModel, "id" | "source_object_id" | "bbox_snapshot" | "surface_origin" | "created_at">>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...patch,
              updated_at: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const assignTask = (taskId: string, assignee: string | null) => {
    updateTask(taskId, { assignee });
  };

  const setTaskStatus = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const attachEvidence = (taskId: string, evidenceId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              evidence_ids: task.evidence_ids.includes(evidenceId) ? task.evidence_ids : [...task.evidence_ids, evidenceId],
              updated_at: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const attachCompare = (taskId: string, compareId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              compare_ids: task.compare_ids.includes(compareId) ? task.compare_ids : [...task.compare_ids, compareId],
              updated_at: new Date().toISOString(),
            }
          : task
      )
    );
  };

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
    incidentFeatures,
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
    updateTask,
    assignTask,
    setTaskStatus,
    attachEvidence,
    attachCompare,
  };
}
