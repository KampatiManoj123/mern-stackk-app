import { Icon } from "./Icons";

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays === -1) return "Overdue (Yesterday)";
    if (diffDays < -1) return `Overdue (${Math.abs(diffDays)}d ago)`;

    return `Due ${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`;
  };

  const priorityClass = {
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  }[task.priority || "medium"];

  return (
    <div className={`task-card-item ${task.completed ? "is-completed" : ""}`}>
      {/* Checkbox */}
      <button
        type="button"
        className={`task-checkbox-btn ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <Icon name="check" size={14} />}
      </button>

      {/* Main Content */}
      <div className="task-main-content">
        <h3
          className="task-card-title"
          style={{
            textDecoration: task.completed ? "line-through" : "none",
            color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
          }}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}

        {/* Metadata */}
        <div className="task-card-metadata">
          {/* Priority */}
          <span className={`badge ${priorityClass}`}>
            {task.priority || "medium"}
          </span>

          {/* Category */}
          {task.category && (
            <span className="badge badge-tag">
              <Icon name="tag" size={11} />
              {task.category}
            </span>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <span
              className={`meta-due-date ${isOverdue ? "is-overdue" : ""}`}
              title={new Date(task.dueDate).toLocaleDateString()}
            >
              <Icon name={isOverdue ? "alert-circle" : "calendar"} size={12} />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        {onEdit && (
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            <Icon name="edit" size={15} />
          </button>
        )}
        <button
          type="button"
          className="btn btn-danger btn-icon"
          onClick={() => onDelete(task._id)}
          title="Delete task"
          aria-label="Delete task"
        >
          <Icon name="trash" size={15} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
