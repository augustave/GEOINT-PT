import { describe, expect, test } from "vitest";
import { buildGeometryScene } from "./geo";
import { createExampleCollection } from "./mockData";

describe("geometry authority scene", () => {
  test("includes bbox, nodes, rings, vectors, labels, overlays, diagnostics, and per-surface renders", () => {
    const features = createExampleCollection();
    const scene = buildGeometryScene({
      selectedFeature: features[0],
      visibleFeatures: features,
      comparedIds: ["STE-203"],
      bbox: [12.35, 41.72, 12.68, 42.02],
      bboxSource: "operational",
    });

    expect(scene.bbox.source).toBe("operational");
    expect(scene.nodes.length).toBeGreaterThan(0);
    expect(scene.rings).toHaveLength(5);
    expect(scene.vectors.length).toBeGreaterThan(0);
    expect(scene.labels.length).toBeGreaterThan(0);
    expect(scene.overlays.length).toBeGreaterThan(0);
    expect(scene.surfaces["flat-map"].bbox.source).toBe("operational");
  });

  test("requires anchored vectors, anchored labels, and bbox metadata for a passing score", () => {
    const features = createExampleCollection();
    const scene = buildGeometryScene({
      selectedFeature: features[0],
      visibleFeatures: features,
      comparedIds: [],
      bbox: [12.35, 41.72, 12.68, 42.02],
      bboxSource: "selection",
    });

    expect(scene.vectors.every((vector) => Boolean(vector.startAnchorId) && Boolean(vector.endAnchorId))).toBe(true);
    expect(scene.labels.every((label) => Boolean(label.anchorId) && Boolean(label.visual.offsetToken))).toBe(true);
    expect(scene.diagnostics.integrityScore.overall).toBeGreaterThanOrEqual(95);
    expect(scene.diagnostics.violations).toEqual([]);
  });

  test("fails when bbox metadata is missing", () => {
    const features = createExampleCollection();
    const scene = buildGeometryScene({
      selectedFeature: features[0],
      visibleFeatures: features,
      comparedIds: [],
      bbox: [12.35, 41.72, 12.68, 42.02],
      bboxSource: undefined as never,
    });

    expect(scene.diagnostics.integrityScore.overall).toBeLessThan(95);
    expect(scene.diagnostics.violations.some((violation) => violation.type === "bbox_missing")).toBe(true);
  });
});
