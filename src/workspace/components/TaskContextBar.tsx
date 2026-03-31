import { ListChecks, Plus } from "lucide-react";
import { statusTone } from "../tasking";
import type { Feature, TaskModel } from "../types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface TaskContextBarProps {
  selectedFeature: Feature;
  currentTask: TaskModel | null;
  taskCount: number;
  onOpenComposer: () => void;
}

export function TaskContextBar(props: TaskContextBarProps) {
  const { selectedFeature, currentTask, taskCount, onOpenComposer } = props;

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <div className="inline-flex min-w-0 items-center gap-2 rounded-md border border-[#d1b16d]/40 bg-[#1a1811] px-2.5 py-1.5 shadow-[0_0_10px_rgba(209,177,109,0.1)]">
        <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Selected</span>
        <span className="max-w-[180px] truncate text-sm font-semibold text-[#e7cf89]">{selectedFeature.properties.labelPrimary}</span>
      </div>
      <div className="hidden h-4 w-px bg-zinc-800 sm:block" />
      <div className="hidden min-w-0 items-center gap-2 rounded-md border border-zinc-800 bg-black/40 px-2 py-1 sm:flex">
        <ListChecks className="h-3.5 w-3.5 text-zinc-400" />
        <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">Mission Thread</span>
        {currentTask ? (
          <>
            <span className={cx("rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em]", statusTone(currentTask.status))}>
              {currentTask.status.replace("_", " ")}
            </span>
            <span className="max-w-[120px] truncate text-[11px] text-zinc-200">{currentTask.type}</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{currentTask.assignee ?? "unassigned"}</span>
          </>
        ) : (
          <span className="text-[11px] text-zinc-400">No task thread</span>
        )}
        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{taskCount}x</span>
      </div>
      <button
        type="button"
        onClick={onOpenComposer}
        className="inline-flex items-center gap-1.5 rounded-md border border-[#b0bf63]/40 bg-[#1b1e11] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#d6dd7b] hover:border-[#b0bf63]"
      >
        <Plus className="h-3 w-3" />
        Task Asset
      </button>
    </div>
  );
}
