import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  loading,
  filter,
  onFilterChange,
  onToggle,
  onEdit,
  onDelete,
  busyTaskId,
}) {
  const filters = [
    { value: "all", label: "All tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <section className="task-list-section">
      <div className="list-heading">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h2>Your tasks <span className="count">{tasks.length}</span></h2>
        </div>
        <div className="filter-tabs" role="group" aria-label="Filter tasks">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={filter === item.value ? "filter-tab active" : "filter-tab"}
              onClick={() => onFilterChange(item.value)}
              aria-pressed={filter === item.value}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="loader" />
          <p>Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <h3>{filter === "completed" ? "Nothing completed yet" : filter === "pending" ? "You're all caught up" : "Your task list is empty"}</h3>
          <p>{filter === "all" ? "Add a task above to get started." : "Try another filter or add a new task."}</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              busy={busyTaskId === task.id}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
