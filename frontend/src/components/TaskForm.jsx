import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
};

export default function TaskForm({ onSubmit, editingTask, onCancelEdit, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
      });
    } else {
      setForm(emptyForm);
    }
    setValidationError("");
  }, [editingTask]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    if (!title) {
      setValidationError("Please enter a task title.");
      return;
    }
    if (title.length > 100) {
      setValidationError("The title must be 100 characters or fewer.");
      return;
    }
    if (form.description.length > 500) {
      setValidationError("The description must be 500 characters or fewer.");
      return;
    }

    setValidationError("");
    const success = await onSubmit({
      title,
      description: form.description.trim() || null,
      priority: form.priority,
    });

    if (success && !editingTask) setForm(emptyForm);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{editingTask ? "UPDATE TASK" : "NEW TASK"}</p>
          <h2>{editingTask ? "Edit your task" : "What needs to get done?"}</h2>
        </div>
      </div>

      <label htmlFor="title">Task title <span className="required">*</span></label>
      <input
        id="title"
        name="title"
        value={form.title}
        onChange={handleChange}
        maxLength={100}
        placeholder="e.g. Practise React useEffect"
        required
      />

      <label htmlFor="description">Description <span className="muted">(optional)</span></label>
      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={handleChange}
        maxLength={500}
        rows={3}
        placeholder="Add a few details..."
      />

      <label htmlFor="priority">Priority</label>
      <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {validationError && <p className="inline-error" role="alert">{validationError}</p>}

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? "Saving..." : editingTask ? "Save changes" : "Add task"}
        </button>
        {editingTask && (
          <button className="secondary-button" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
