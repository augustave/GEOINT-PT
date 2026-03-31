import { queueBuckets, statusTone } from "../tasking";
import { CLS } from "../styles";
import type { TaskModel } from "../types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface TaskQueuePanelProps {
  tasks: TaskModel[];
  onSelectTask: (taskId: string) => void;
}

export function TaskQueuePanel(props: TaskQueuePanelProps) {
  const { tasks, onSelectTask } = props;
  const buckets = queueBuckets(tasks);

  return (
    <div className="space-y-3">
      {[
        { label: "Active Tasks", items: buckets.active },
        { label: "Blocked Tasks", items: buckets.blocked },
        { label: "Verification Queue", items: buckets.verification },
        { label: "Recent Updates", items: buckets.recent },
      ].map((section) => (
        <div key={section.label} className="rounded-xl border border-zinc-800/60 bg-[#181914]/80 p-3">
          <div className="flex items-center justify-between">
            <div className={CLS.meta}>{section.label}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{section.items.length}</div>
          </div>
          <div className="mt-3 space-y-2">
            {section.items.length ? (
              section.items.map((task) => (
                <button
                  key={`${section.label}-${task.id}`}
                  type="button"
                  onClick={() => onSelectTask(task.id)}
                  className="w-full rounded-lg border border-zinc-800 bg-black/45 px-2.5 py-2 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm text-zinc-100">{task.source_object_id} · {task.type}</div>
                      <div className="mt-1 text-[11px] text-zinc-500">{task.assignee ?? "Unassigned"}</div>
                    </div>
                    <span className={cx("rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em]", statusTone(task.status))}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-800 px-3 py-2 text-[11px] text-zinc-500">No tasks in this queue.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
