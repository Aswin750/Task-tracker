import { useCallback, useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  createTask,
  deleteTask,
  getTasks,
  setTaskCompletion,
  updateTask,
} from "./api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks("all");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const visibleTasks = useMemo(() => {
    if (filter === "pending") return tasks.filter((task) => !task.is_completed);
    if (filter === "completed") return tasks.filter((task) => task.is_completed);
    return tasks;
  }, [tasks, filter]);

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => !task.is_completed).length,
    completed: tasks.filter((task) => task.is_completed).length,
  }), [tasks]);

  async function handleSubmit(taskData) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks((current) => current.map((task) => task.id === updated.id ? updated : task));
        setEditingTask(null);
        setNotice("Task updated successfully.");
      } else {
        const created = await createTask(taskData);
        setTasks((current) => [created, ...current]);
        setNotice("Task added successfully.");
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task, isCompleted) {
    setBusyTaskId(task.id);
    setError("");
    setNotice("");
    try {
      const updated = await setTaskCompletion(task.id, isCompleted);
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(isCompleted ? "Task marked completed." : "Task marked pending.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyTaskId(null);
    }
  }

  function handleEdit(task) {
    setEditingTask(task);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setBusyTaskId(task.id);
    setError("");
    setNotice("");
    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      if (editingTask?.id === task.id) setEditingTask(null);
      setNotice("Task deleted.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyTaskId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Personal Task Tracker home">
          <span className="brand-mark">✓</span>
          <span>Taskwise</span>
        </a>
        <span className="topbar-note">A little progress every day.</span>
      </header>

      <main className="page-content">
        <section className="hero">
          <div>
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h1>Make room for<br /><span>what matters.</span></h1>
            <p className="hero-copy">Keep your tasks clear, your priorities focused, and your progress moving.</p>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <span className="decoration-circle circle-one" />
            <span className="decoration-circle circle-two" />
            <span className="decoration-check">✓</span>
          </div>
        </section>

        <section className="stats-grid" aria-label="Task summary">
          <div className="stat-card">
            <span className="stat-label">Total tasks</span>
            <strong>{counts.total}</strong>
            <span className="stat-foot">In your workspace</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <strong>{counts.pending}</strong>
            <span className="stat-foot">Still to do</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <strong>{counts.completed}</strong>
            <span className="stat-foot">Nice work!</span>
          </div>
        </section>

        {error && (
          <div className="message error-message" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error">×</button>
          </div>
        )}
        {notice && (
          <div className="message success-message" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        <div className="workspace-grid">
          <aside className="form-panel">
            <TaskForm
              onSubmit={handleSubmit}
              editingTask={editingTask}
              onCancelEdit={() => setEditingTask(null)}
              saving={saving}
            />
          </aside>

          <div className="list-panel">
            <TaskList
              tasks={visibleTasks}
              loading={loading}
              filter={filter}
              onFilterChange={setFilter}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              busyTaskId={busyTaskId}
            />
          </div>
        </div>
      </main>

      <footer className="footer">
        <span>Taskwise</span>
        <span>Small steps add up.</span>
      </footer>
    </div>
  );
}
