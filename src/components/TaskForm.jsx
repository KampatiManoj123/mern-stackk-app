import { useState, useEffect } from "react";
import { Icon } from "./Icons";

const CATEGORIES = ["General", "Work", "Personal", "Study", "Finance", "Health", "Projects"];

const TaskForm = ({ onSave, initialData = null, onCancel = null, isModal = false }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPriority(initialData.priority || "medium");
      setCategory(initialData.category || "General");
      if (initialData.dueDate) {
        setDueDate(initialData.dueDate.split("T")[0]);
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("General");
      setDueDate("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    setError("");

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate || null,
    });

    if (!initialData) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("General");
      setDueDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form-wrapper">
      {error && (
        <div
          style={{
            padding: "8px 12px",
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "6px",
            marginBottom: "12px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      )}

      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-title-input">
          Task Title *
        </label>
        <input
          id="task-title-input"
          className="form-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="task-desc-input">
          Description (Optional)
        </label>
        <textarea
          id="task-desc-input"
          className="form-textarea"
          placeholder="Add details, notes, or sub-points..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Grid of metadata */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        {/* Priority */}
        <div>
          <label className="form-label" htmlFor="task-priority-select">
            Priority
          </label>
          <select
            id="task-priority-select"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="form-label" htmlFor="task-category-select">
            Category
          </label>
          <select
            id="task-category-select"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="form-label" htmlFor="task-due-date-input">
            Due Date
          </label>
          <input
            id="task-due-date-input"
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          <Icon name={initialData ? "check" : "plus"} size={16} />
          {initialData ? "Save Changes" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;