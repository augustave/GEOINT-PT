import { missionStageForTask, MISSION_STAGES, statusTone } from "../tasking";
import { CLS } from "../styles";
import type { MissionThreadModel, TaskModel } from "../types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface MissionThreadPanelProps {
  thread: MissionThreadModel | null;
  tasks: TaskModel[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

export function MissionThreadPanel(props: MissionThreadPanelProps) {
  const { thread, tasks, selectedTaskId, onSelectTask } = props;

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-[#181914]/80 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className={CLS.meta}>Mission Thread</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{thread ? thread.current_stage : "detect"}</div>
      </div>
      {tasks.length ? (
        <div className="space-y-3">
          {MISSION_STAGES.map((stage) => {
            const stageTasks = tasks.filter((task) => missionStageForTask(task) === stage);
            return (
              <div key={stage}>
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{stage}</div>
                <div className="mt-2 space-y-2">
                  {stageTasks.length ? (
                    stageTasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onSelectTask(task.id)}
                        className={cx(
                          "w-full rounded-lg border px-3 py-2 text-left",
                          selectedTaskId === task.id ? "border-[#d1b16d]/60 bg-[#232116]" : "border-zinc-800 bg-[#12130f]"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm text-zinc-100">{task.type}</div>
                          <span className={cx("rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em]", statusTone(task.status))}>
                            {task.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-zinc-500">{task.assignee ?? "Unassigned"} · {new Date(task.updated_at).toLocaleString()}</div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-zinc-800 px-3 py-2 text-[11px] text-zinc-500">No tasks in this stage.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-zinc-500">No mission thread has been created for this object yet.</div>
      )}
    </div>
  );
}
