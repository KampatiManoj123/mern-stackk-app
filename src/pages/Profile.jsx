import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Icon } from "../components/Icons";

const Profile = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [defaultPriority, setDefaultPriority] = useState(
    () => localStorage.getItem("pref_priority") || "medium"
  );
  const [defaultCategory, setDefaultCategory] = useState(
    () => localStorage.getItem("pref_category") || "General"
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => localStorage.getItem("pref_notif") !== "false"
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem("pref_priority", defaultPriority);
    localStorage.setItem("pref_category", defaultCategory);
    localStorage.setItem("pref_notif", notificationsEnabled.toString());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export tasks as JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `taskflow_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear completed tasks
  const handleClearCompleted = async () => {
    if (!window.confirm("Are you sure you want to delete all completed tasks? This cannot be undone.")) return;
    const completedList = tasks.filter((t) => t.completed);
    try {
      for (const t of completedList) {
        await api.delete(`/tasks/${t._id}`);
      }
      setTasks(tasks.filter((t) => !t.completed));
      alert(`Cleared ${completedList.length} completed tasks!`);
    } catch (err) {
      alert("Failed to clear some completed tasks.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="page-container-sm">
      <div className="page-header">
        <h1 className="page-title">
          <Icon name="user" size={28} />
          <span>Profile & Workspace Settings</span>
        </h1>
        <p className="page-subtitle">
          Manage your account profile, productivity defaults, and task data.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* User Card */}
        <div className="card-panel" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#fff",
              fontSize: "26px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)" }}>
              {user?.name || "TaskFlow User"}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {user?.email || "No email available"}
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <span className="badge badge-tag" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                Active Pro Plan
              </span>
              <span className="badge badge-tag">
                {totalTasks} Total Tasks
              </span>
            </div>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="card-panel">
          <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px", color: "var(--text-primary)" }}>
            Productivity Preferences
          </h3>

          {saveSuccess && (
            <div
              style={{
                padding: "10px 14px",
                background: "#ecfdf5",
                color: "#059669",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "16px",
              }}
            >
              Preferences saved successfully!
            </div>
          )}

          <form onSubmit={handleSavePreferences}>
            <div className="form-group">
              <label className="form-label" htmlFor="pref-priority">
                Default Task Priority
              </label>
              <select
                id="pref-priority"
                className="form-select"
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pref-cat">
                Default Category
              </label>
              <select
                id="pref-cat"
                className="form-select"
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
                <option value="Projects">Projects</option>
              </select>
            </div>

            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
              <input
                id="pref-notif"
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                style={{ width: "18px", height: "18px", margin: 0 }}
              />
              <label htmlFor="pref-notif" style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", cursor: "pointer" }}>
                Enable daily task reminder toasts and completion sounds
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "12px" }}>
              <Icon name="check" size={16} />
              <span>Save Preferences</span>
            </button>
          </form>
        </div>

        {/* Data & Backup */}
        <div className="card-panel">
          <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "6px", color: "var(--text-primary)" }}>
            Data Backup & Export
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Export all your tasks, notes, priorities, and dates into JSON format for secure backup or import.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-secondary" onClick={handleExportData}>
              <Icon name="download" size={16} />
              <span>Export All Tasks (.json)</span>
            </button>

            <button type="button" className="btn btn-danger" onClick={handleClearCompleted}>
              <Icon name="trash" size={16} />
              <span>Clear Completed Tasks ({completedTasks})</span>
            </button>
          </div>
        </div>

        {/* Security & Logout */}
        <div className="card-panel" style={{ border: "1px solid #fee2e2" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "6px", color: "#dc2626" }}>
            Session Management
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Logged in as {user?.email}. End your active workspace session securely.
          </p>

          <button type="button" className="btn btn-danger" onClick={logout}>
            <Icon name="logout" size={16} />
            <span>Sign Out of TaskFlow</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
