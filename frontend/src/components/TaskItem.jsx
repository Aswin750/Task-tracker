function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  busy,
}) {
  return (
    <article className={`task-card ${task.is_completed ? "is-completed" : ""}`}>
      <label className="task-check" aria-label={`Mark ${task.title} as ${task.is_completed ? "pending" : "completed"}`}>
        <input
          type="checkbox"
          checked={task.is_completed}
          disabled={busy}
          onChange={(event) => onToggle(task, event.target.checked)}
        />
        <span className="custom-check" />
      </label>

      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className={`priority priority-${task.priority.toLowerCase()}`}>
            {task.priority} priority
          </span>
          <span className="task-date">Added {formatDate(task.created_at)}</span>
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => onEdit(task)}
          disabled={busy}
          aria-label={`Edit ${task.title}`}
          title="Edit task"
        >
          ✎
        </button>
        <button
          type="button"
          className="icon-button delete-button"
          onClick={() => onDelete(task)}
          disabled={busy}
          aria-label={`Delete ${task.title}`}
          title="Delete task"
        >
          ×
        </button>
      </div>
    </article>
  );
}
