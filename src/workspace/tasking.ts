import type {
  BBoxModel,
  CreateTaskInput,
  Feature,
  MissionStage,
  MissionThreadModel,
  Priority,
  TaskModel,
  TaskStatus,
  TaskType,
  WorkspaceMode,
} from "./types";

export const TASK_TYPE_OPTIONS: TaskType[] = ["review", "verify", "monitor", "compare", "annotate", "escalate", "handoff", "watch"];
export const TASK_STATUS_OPTIONS: TaskStatus[] = ["draft", "queued", "active", "blocked", "under_review", "verified", "closed"];
export const MISSION_STAGES: MissionStage[] = ["detect", "assess", "assign", "act", "verify"];

const TASK_STATUS_WEIGHT: Record<TaskStatus, number> = {
  draft: 0,
  queued: 1,
  active: 2,
  blocked: 3,
  under_review: 4,
  verified: 5,
  closed: 6,
};

const PRIORITY_WEIGHT: Record<Priority, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

function buildTaskId(sourceObjectId: string, createdAt: string) {
  return `task-${sourceObjectId.toLowerCase()}-${createdAt.replace(/[^0-9]/g, "").slice(0, 14)}`;
}

export function missionStageForTask(task: TaskModel): MissionStage {
  if (task.status === "verified" || task.status === "closed") {
    return "verify";
  }

  if (task.status === "active" || task.status === "under_review") {
    return "act";
  }

  if (task.assignee || task.type === "escalate" || task.type === "handoff") {
    return "assign";
  }

  if (task.type === "review" || task.type === "compare" || task.type === "annotate" || task.type === "verify") {
    return "assess";
  }

  return "detect";
}

export function createTaskFromObject(params: {
  input: CreateTaskInput;
  sourceFeature: Feature;
  bboxSnapshot: BBoxModel;
  surfaceOrigin: WorkspaceMode;
}): TaskModel {
  const createdAt = new Date().toISOString();
  const { input, sourceFeature, bboxSnapshot, surfaceOrigin } = params;

  return {
    id: buildTaskId(sourceFeature.properties.id, createdAt),
    type: input.type,
    status: "draft",
    priority: sourceFeature.properties.priority,
    assignee: input.assignee?.trim() ? input.assignee.trim() : null,
    created_at: createdAt,
    updated_at: createdAt,
    source_object_id: sourceFeature.properties.id,
    bbox_snapshot: {
      coordinates: [...bboxSnapshot.coordinates] as BBoxModel["coordinates"],
      source: bboxSnapshot.source,
    },
    surface_origin: surfaceOrigin,
    notes: input.notes.trim(),
    evidence_ids: [...new Set(input.evidence_ids)],
    compare_ids: [...new Set(input.compare_ids)],
    time_window: input.time_window?.trim() ? input.time_window.trim() : null,
  };
}

export function buildMissionThreads(tasks: TaskModel[]): MissionThreadModel[] {
  const grouped = new Map<string, TaskModel[]>();

  tasks.forEach((task) => {
    const list = grouped.get(task.source_object_id) ?? [];
    list.push(task);
    grouped.set(task.source_object_id, list);
  });

  return [...grouped.entries()]
    .map(([objectId, objectTasks]) => {
      const ordered = [...objectTasks].sort((a, b) => a.created_at.localeCompare(b.created_at));
      const currentTask = ordered[ordered.length - 1];
      return {
        id: `thread-${objectId.toLowerCase()}`,
        object_id: objectId,
        task_ids: ordered.map((task) => task.id),
        current_stage: currentTask ? missionStageForTask(currentTask) : "detect",
      };
    })
    .sort((a, b) => a.object_id.localeCompare(b.object_id));
}

export function tasksForObject(tasks: TaskModel[], objectId: string) {
  return tasks
    .filter((task) => task.source_object_id === objectId)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function missionThreadForObject(threads: MissionThreadModel[], objectId: string) {
  return threads.find((thread) => thread.object_id === objectId) ?? null;
}

export function currentTaskForObject(tasks: TaskModel[], objectId: string, selectedTaskId?: string | null) {
  const objectTasks = tasksForObject(tasks, objectId);
  if (!objectTasks.length) {
    return null;
  }

  if (selectedTaskId) {
    const selected = objectTasks.find((task) => task.id === selectedTaskId);
    if (selected) {
      return selected;
    }
  }

  return [...objectTasks].sort((a, b) => {
    const statusDelta = TASK_STATUS_WEIGHT[b.status] - TASK_STATUS_WEIGHT[a.status];
    if (statusDelta !== 0) {
      return statusDelta;
    }
    const priorityDelta = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (priorityDelta !== 0) {
      return priorityDelta;
    }
    return b.updated_at.localeCompare(a.updated_at);
  })[0];
}

export function statusTone(status: TaskStatus) {
  switch (status) {
    case "active":
      return "border-[#ef8f45] bg-[#2a1d12] text-[#f2a86b]";
    case "verified":
    case "closed":
      return "border-[#88b779] bg-[#132015] text-[#bfe0b2]";
    case "blocked":
      return "border-[#c36262] bg-[#241414] text-[#f0a2a2]";
    case "under_review":
      return "border-[#5ea7c9] bg-[#122029] text-[#9cd9f6]";
    case "queued":
      return "border-[#b0bf63] bg-[#1b1e11] text-[#d6dd7b]";
    default:
      return "border-zinc-700 bg-[#1b1c16] text-zinc-300";
  }
}

export function priorityTone(priority: Priority) {
  switch (priority) {
    case "critical":
      return "text-[#f0a2a2]";
    case "high":
      return "text-[#f2a86b]";
    case "medium":
      return "text-[#d6dd7b]";
    default:
      return "text-zinc-400";
  }
}

export function queueBuckets(tasks: TaskModel[]) {
  return {
    active: tasks.filter((task) => task.status === "active"),
    blocked: tasks.filter((task) => task.status === "blocked"),
    verification: tasks.filter((task) => task.status === "under_review" || task.status === "verified"),
    recent: [...tasks].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 5),
  };
}
