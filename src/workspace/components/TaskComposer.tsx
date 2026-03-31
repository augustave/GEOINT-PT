import { useEffect, useState } from "react";
import type { CreateTaskInput, Feature, TaskType } from "../types";
import { TASK_TYPE_OPTIONS } from "../tasking";

interface TaskComposerProps {
  open: boolean;
  selectedFeature: Feature;
  comparedFeatures: Feature[];
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => void;
}

export function TaskComposer(props: TaskComposerProps) {
  const { open, selectedFeature, comparedFeatures, onClose, onSubmit } = props;
  const [taskType, setTaskType] = useState<TaskType>("review");
  const [assignee, setAssignee] = useState("");
  const [timeWindow, setTimeWindow] = useState("");
  const [notes, setNotes] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [evidenceIds, setEvidenceIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setTaskType("review");
    setAssignee("");
    setTimeWindow("");
    setNotes(`Review ${selectedFeature.properties.labelPrimary} against current geometry context.`);
    setCompareIds([]);
    setEvidenceIds([]);
  }, [open, selectedFeature.properties.labelPrimary]);

  if (!open) {
    return null;
  }

  const toggleValue = (value: string, values: string[], setValues: (next: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <div className="border-t border-zinc-800/70 bg-[#0d0e0a] px-4 py-4">
      <div className="grid gap-4 xl:grid-cols-[220px_220px_minmax(0,1fr)]">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Task Type</div>
          <select value={taskType} onChange={(event) => setTaskType(event.target.value as TaskType)} className="w-full rounded-md border border-zinc-700 bg-[#11120f] px-3 py-2 text-sm text-zinc-100">
            {TASK_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Assignee</div>
          <input
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="Optional owner"
            className="w-full rounded-md border border-zinc-700 bg-[#11120f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
          />
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Time Window</div>
          <input
            value={timeWindow}
            onChange={(event) => setTimeWindow(event.target.value)}
            placeholder="Optional timing"
            className="w-full rounded-md border border-zinc-700 bg-[#11120f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Attach Compare</div>
            <div className="mt-2 space-y-1.5">
              {comparedFeatures.length ? (
                comparedFeatures.map((feature) => (
                  <label key={feature.properties.id} className="flex items-center gap-2 rounded-md border border-zinc-800 bg-[#12130f] px-2.5 py-2 text-sm text-zinc-200">
                    <input
                      type="checkbox"
                      checked={compareIds.includes(feature.properties.id)}
                      onChange={() => toggleValue(feature.properties.id, compareIds, setCompareIds)}
                    />
                    <span className="truncate">{feature.properties.id} · {feature.properties.labelPrimary}</span>
                  </label>
                ))
              ) : (
                <div className="rounded-md border border-zinc-800 bg-[#12130f] px-2.5 py-2 text-sm text-zinc-500">No compare pins available.</div>
              )}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Attach Evidence</div>
            <div className="mt-2 space-y-1.5">
              {selectedFeature.properties.evidenceRefs.map((ref) => (
                <label key={ref} className="flex items-center gap-2 rounded-md border border-zinc-800 bg-[#12130f] px-2.5 py-2 text-sm text-zinc-200">
                  <input type="checkbox" checked={evidenceIds.includes(ref)} onChange={() => toggleValue(ref, evidenceIds, setEvidenceIds)} />
                  <span className="truncate">{ref}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Notes</div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={7}
            className="w-full rounded-md border border-zinc-700 bg-[#11120f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-zinc-500">
              Source object: <span className="text-zinc-200">{selectedFeature.properties.id}</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="rounded-md border border-zinc-700 bg-[#12130f] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-zinc-300">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSubmit({
                    type: taskType,
                    assignee,
                    time_window: timeWindow,
                    notes,
                    evidence_ids: evidenceIds,
                    compare_ids: compareIds,
                  });
                  onClose();
                }}
                className="rounded-md border border-[#b0bf63]/50 bg-[#1b1e11] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[#d6dd7b]"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
