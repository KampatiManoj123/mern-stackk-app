import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { Icon } from "../components/Icons";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'completed'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'due_date', 'priority'

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Handlers
  const handleAdd = async (data) => {
    try {
      const res = await api.post("/tasks", data);
      setTasks([res.data, ...tasks]);
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Could not add task");
    }
  };

  const handleEdit = async (data) => {
    if (!editingTask) return;
    try {
      const res = await api.put(`/tasks/${editingTask._id}`, data);
      setTasks(tasks.map((t) => (t._id === editingTask._id ? res.data : t)));
      setEditingTask(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not update task");
    }
  };

  const handleToggle = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not toggle task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete task");
    }
  };

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = tasks.filter((t) => !t.completed && t.priority === "high").length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === "active" && task.completed) return false;
        if (statusFilter === "completed" && !task.completed) return false;

        // Priority filter
        if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;

        // Category filter
        if (categoryFilter !== "all" && (task.category || "General") !== categoryFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title?.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchCategory = task.category?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === "due_date") {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === "priority") {
          const weights = { high: 3, medium: 2, low: 1 };
          return (weights[b.priority] || 2) - (weights[a.priority] || 2);
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy]);

  // Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page-container">
      <div className="dashboard-layout">
        {/* Banner with Greeting & Quick Add */}
        <div className="dash-banner">
          <div className="dash-banner-content">
            <h1>
              {getGreeting()}, {user?.name || "Productivity Hero"} 👋
            </h1>
            <p>
              Today is {formattedDate}. You have <strong>{pendingCount}</strong> pending{" "}
              {pendingCount === 1 ? "task" : "tasks"} to tackle today.
            </p>
          </div>

          <div className="dash-banner-actions">
            <button
              type="button"
              className="btn-banner-add"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Icon name="plus" size={18} />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dash-stats-grid">
          {/* Total Tasks */}
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-blue">
              <Icon name="dashboard" size={24} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total Assigned</span>
            </div>
          </div>

          {/* Completed Rate */}
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-green">
              <Icon name="check-circle" size={24} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <span className="stat-value">
                {completedCount} <span style={{ fontSize: "14px", fontWeight: "600", color: "#059669" }}>({completionRate}%)</span>
              </span>
              <span className="stat-label">Tasks Finished</span>
              <div className="stat-progress-bar">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-amber">
              <Icon name="clock" size={24} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">In Progress / Due</span>
            </div>
          </div>

          {/* High Priority */}
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-purple">
              <Icon name="alert-circle" size={24} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <span className="stat-value">{highPriorityCount}</span>
              <span className="stat-label">High Priority Active</span>
            </div>
          </div>
        </div>

        {/* Search, Filter & Tabs Toolbar */}
        <div className="dash-controls">
          <div className="dash-controls-top">
            {/* Search Input */}
            <div className="search-input-wrap">
              <span className="search-icon-pos">
                <Icon name="search" size={18} />
              </span>
              <input
                type="text"
                className="search-field"
                placeholder="Search tasks by keyword, details, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="dash-filter-group">
              {/* Category */}
              <select
                className="select-pill"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Projects">Projects</option>
              </select>

              {/* Priority */}
              <select
                className="select-pill"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              {/* Sort By */}
              <select
                className="select-pill"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort tasks by"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="due_date">Sort: Due Date</option>
                <option value="priority">Sort: Highest Priority</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="status-tabs">
            <button
              type="button"
              className={`status-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              <span>All Tasks</span>
              <span className="tab-badge">{totalCount}</span>
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === "active" ? "active" : ""}`}
              onClick={() => setStatusFilter("active")}
            >
              <span>Active</span>
              <span className="tab-badge">{pendingCount}</span>
            </button>
            <button
              type="button"
              className={`status-tab ${statusFilter === "completed" ? "active" : ""}`}
              onClick={() => setStatusFilter("completed")}
            >
              <span>Completed</span>
              <span className="tab-badge">{completedCount}</span>
            </button>
          </div>
        </div>

        {/* Task List Section */}
        {loading ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontWeight: "600",
            }}
          >
            Loading your tasks...
          </div>
        ) : error ? (
          <div className="card-panel" style={{ color: "#b91c1c", background: "#fef2f2" }}>
            {error}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="dash-empty-state">
            <div className="empty-state-icon">
              <Icon name="check-circle" size={36} />
            </div>
            <h3 className="empty-state-title">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                ? "No tasks match your criteria"
                : "No tasks yet!"}
            </h3>
            <p className="empty-state-subtitle">
              {searchQuery || statusFilter !== "all"
                ? "Try clearing your filters or changing the search terms."
                : "Organize your workflow and take charge of your schedule by adding your first task."}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Icon name="plus" size={16} />
              <span>Create New Task</span>
            </button>
          </div>
        ) : (
          <div className="task-items-container">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={(t) => setEditingTask(t)}
              />
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        {isAddModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Create New Task</h3>
                <button
                  type="button"
                  className="btn btn-icon btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                  aria-label="Close modal"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
              <div className="modal-body">
                <TaskForm
                  onSave={handleAdd}
                  onCancel={() => setIsAddModalOpen(false)}
                  isModal={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="modal-backdrop" onClick={() => setEditingTask(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Edit Task</h3>
                <button
                  type="button"
                  className="btn btn-icon btn-secondary"
                  onClick={() => setEditingTask(null)}
                  aria-label="Close modal"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
              <div className="modal-body">
                <TaskForm
                  initialData={editingTask}
                  onSave={handleEdit}
                  onCancel={() => setEditingTask(null)}
                  isModal={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;