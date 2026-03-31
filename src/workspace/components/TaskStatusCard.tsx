import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { statusTone } from "../tasking";
import { CLS } from "../styles";
import type { TaskModel, TaskStatus } from "../types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface TaskStatusCardProps {
  task: TaskModel | null;
  onAssignTask: (taskId: string, assignee: string | null) => void;
  onSetTaskStatus: (taskId: string, status: TaskStatus) => void;
}

export function TaskStatusCard(props: TaskStatusCardProps) {
  const { task, onAssignTask, onSetTaskStatus } = props;
  const [assigneeInput, setAssigneeInput] = useState("");

  useEffect(() => {
    setAssigneeInput(task?.assignee ?? "");
  }, [task]);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-[#181914]/80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className={CLS.meta}>Current Task</div>
        {task ? <span className={cx("rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em]", statusTone(task.status))}>{task.status.replace("_", " ")}</span> : null}
      </div>
      {task ? (
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium text-zinc-100">{task.type}</div>
            <div className="mt-1 text-[12px] text-zinc-400">{task.notes}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className={CLS.dossierSection}>
              <div className={CLS.meta}>Assignee</div>
              <div className="mt-1 text-zinc-100">{task.assignee ?? "Unassigned"}</div>
            </div>
            <div className={CLS.dossierSection}>
              <div className={CLS.meta}>Priority</div>
              <div className="mt-1 text-zinc-100">{task.priority}</div>
            </div>
            <div className={CLS.dossierSection}>
              <div className={CLS.meta}>Evidence</div>
              <div className="mt-1 text-zinc-100">{task.evidence_ids.length}</div>
            </div>
            <div className={CLS.dossierSection}>
              <div className={CLS.meta}>Compare</div>
              <div className="mt-1 text-zinc-100">{task.compare_ids.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <Clock3 className="h-3.5 w-3.5" />
            Updated {new Date(task.updated_at).toLocaleString()}
          </div>
          <div className="flex gap-2">
            <input
              value={assigneeInput}
              onChange={(event) => setAssigneeInput(event.target.value)}
              placeholder="Assign owner"
              className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-[#11120f] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
            />
            <button
              type="button"
              onClick={() => onAssignTask(task.id, assigneeInput.trim() || null)}
              className="rounded-md border border-zinc-700 bg-[#12130f] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-zinc-300"
            >
              Assign
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["queued", "active", "under_review", "verified", "closed"] as TaskStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onSetTaskStatus(task.id, status)}
                className={cx(
                  "rounded-md border px-2 py-1 text-[10px] uppercase tracking-[0.16em]",
                  task.status === status ? statusTone(status) : "border-zinc-700 bg-[#12130f] text-zinc-300"
                )}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-zinc-500">No task created for this object yet.</div>
      )}
    </div>
  );
}
