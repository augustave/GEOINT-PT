import { priorityTone, statusTone } from "../tasking";
import type { Priority, TaskStatus } from "../types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface TaskChipProps {
  count: number;
  status?: TaskStatus | null;
  priority?: Priority | null;
  compact?: boolean;
}

export function TaskChip(props: TaskChipProps) {
  const { count, status, priority, compact } = props;
  if (count <= 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {status ? (
        <span
          className={cx(
            "rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em]",
            statusTone(status),
            compact && "text-[8px]"
          )}
        >
          {status.replace("_", " ")}
        </span>
      ) : null}
      <span className="rounded-full border border-zinc-700 bg-[#11120f] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-zinc-300">
        {count} task{count === 1 ? "" : "s"}
      </span>
      {priority ? <span className={cx("text-[9px] uppercase tracking-[0.14em]", priorityTone(priority))}>{priority}</span> : null}
    </div>
  );
}
