import { describe, expect, test } from "vitest";
import { createExampleCollection } from "./mockData";
import { buildMissionThreads, createTaskFromObject, currentTaskForObject, missionStageForTask } from "./tasking";

const feature = createExampleCollection()[0];

describe("tasking", () => {
  test("creates a task from a selected object with a read-only bbox snapshot", () => {
    const task = createTaskFromObject({
      input: {
        type: "review",
        notes: "Review the selected object.",
        evidence_ids: ["RPT-001"],
        compare_ids: ["STE-203"],
      },
      sourceFeature: feature,
      bboxSnapshot: {
        coordinates: [1, 2, 3, 4],
        source: "selection",
      },
      surfaceOrigin: "flat-map",
    });

    expect(task.source_object_id).toBe(feature.properties.id);
    expect(task.bbox_snapshot.coordinates).toEqual([1, 2, 3, 4]);
    expect(task.surface_origin).toBe("flat-map");
    expect(task.evidence_ids).toEqual(["RPT-001"]);
    expect(task.compare_ids).toEqual(["STE-203"]);
  });

  test("derives mission thread stage from task status without introducing geometry", () => {
    const activeTask = createTaskFromObject({
      input: {
        type: "verify",
        notes: "Verify target state.",
        evidence_ids: [],
        compare_ids: [],
      },
      sourceFeature: feature,
      bboxSnapshot: {
        coordinates: [0, 0, 1, 1],
        source: "operational",
      },
      surfaceOrigin: "eo-overlay",
    });

    activeTask.status = "under_review";

    expect(missionStageForTask(activeTask)).toBe("act");
    expect(buildMissionThreads([activeTask])).toEqual([
      {
        id: `thread-${feature.properties.id.toLowerCase()}`,
        object_id: feature.properties.id,
        task_ids: [activeTask.id],
        current_stage: "act",
      },
    ]);
  });

  test("prefers the explicitly selected task for an object thread", () => {
    const firstTask = createTaskFromObject({
      input: {
        type: "monitor",
        notes: "Monitor object.",
        evidence_ids: [],
        compare_ids: [],
      },
      sourceFeature: feature,
      bboxSnapshot: {
        coordinates: [0, 0, 1, 1],
        source: "operational",
      },
      surfaceOrigin: "ops-wall",
    });
    const secondTask = {
      ...firstTask,
      id: `${firstTask.id}-2`,
      type: "escalate" as const,
      status: "active" as const,
      updated_at: "2026-03-30T16:00:00.000Z",
    };

    expect(currentTaskForObject([firstTask, secondTask], feature.properties.id, secondTask.id)?.id).toBe(secondTask.id);
  });
});
