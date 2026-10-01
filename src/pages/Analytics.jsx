import { useEffect, useState } from "react";
import api from "../api/axios";
import { Icon } from "../components/Icons";

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Could not fetch tasks for analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority counts
  const highPriority = tasks.filter((t) => t.priority === "high");
  const medPriority = tasks.filter((t) => t.priority === "medium" || !t.priority);
  const lowPriority = tasks.filter((t) => t.priority === "low");

  // Category counts
  const categories = {};
  tasks.forEach((t) => {
    const cat = t.category || "General";
    categories[cat] = (categories[cat] || 0) + 1;
  });

  // Overdue count
  const overdueCount = tasks.filter(
    (t) =>
      t.dueDate &&
      !t.completed &&
      new Date(t.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
  ).length;

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px 0" }}>
        <h3>Loading your productivity insights...</h3>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <Icon name="chart" size={28} />
          <span>Productivity & Analytics</span>
        </h1>
        <p className="page-subtitle">
          Real-time metrics, completion velocity, and workload distribution.
        </p>
      </div>

      {/* Main KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {/* Completion Rate Card */}
        <div className="card-panel" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Radial meter */}
          <div style={{ position: "relative", width: "90px", height: "90px", flexShrink: 0 }}>
            <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3.6"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.6"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "800",
                fontSize: "18px",
                color: "var(--text-primary)",
              }}
            >
              {completionRate}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>
              Completion Score
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
              {completed} of {total}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
              {pending} pending items left
            </div>
          </div>
        </div>

        {/* Workload Health */}
        <div className="card-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>
              Workload Health
            </div>
            <Icon name={overdueCount > 0 ? "alert-circle" : "check-circle"} size={20} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", marginTop: "12px" }}>
            {overdueCount === 0 ? "Optimal" : `${overdueCount} Overdue`}
          </div>
          <p style={{ fontSize: "13px", color: overdueCount > 0 ? "#dc2626" : "#059669", marginTop: "6px" }}>
            {overdueCount === 0
              ? "All deadlines are under control! Keep it up."
              : "Some tasks have passed their due dates."}
          </p>
        </div>

        {/* Productivity Efficiency */}
        <div className="card-panel">
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>
            Productivity Momentum
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "12px" }}>
            <span style={{ fontSize: "26px", fontWeight: "800" }}>
              {total > 0 ? (completionRate >= 70 ? "High 🔥" : completionRate >= 40 ? "Steady ⚡" : "Starting 🚀") : "Fresh"}
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
            {completionRate >= 70
              ? "Exceptional velocity! You are crushing your goals."
              : "Focus on closing 1-2 quick tasks to build momentum."}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Priorities & Categories */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        {/* Priority Breakdown */}
        <div className="card-panel">
          <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="tag" size={18} />
            <span>Priority Breakdown</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* High */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                <span style={{ color: "#b91c1c" }}>High Priority</span>
                <span>{highPriority.length} tasks ({total > 0 ? Math.round((highPriority.length / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "#ef4444",
                    width: `${total > 0 ? (highPriority.length / total) * 100 : 0}%`,
                    borderRadius: "999px",
                  }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                <span style={{ color: "#b45309" }}>Medium Priority</span>
                <span>{medPriority.length} tasks ({total > 0 ? Math.round((medPriority.length / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "#f59e0b",
                    width: `${total > 0 ? (medPriority.length / total) * 100 : 0}%`,
                    borderRadius: "999px",
                  }}
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                <span style={{ color: "#0369a1" }}>Low Priority</span>
                <span>{lowPriority.length} tasks ({total > 0 ? Math.round((lowPriority.length / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    background: "#3b82f6",
                    width: `${total > 0 ? (lowPriority.length / total) * 100 : 0}%`,
                    borderRadius: "999px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="card-panel">
          <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="dashboard" size={18} />
            <span>Category Distribution</span>
          </h2>

          {Object.keys(categories).length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No categories assigned yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {Object.entries(categories).map(([catName, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={catName}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                      <span>{catName}</span>
                      <span style={{ color: "var(--text-secondary)" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          background: "#6366f1",
                          width: `${pct}%`,
                          borderRadius: "999px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Actionable Tips Card */}
      <div
        className="card-panel"
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
          border: "1px solid #bfdbfe",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "#3b82f6",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="sparkles" size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e3a8a", marginBottom: "4px" }}>
              Smart Productivity Recommendation
            </h3>
            <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
              {highPriority.length > 2
                ? "You currently have multiple high-priority tasks pending. Research shows that applying the 'Eat the Frog' technique—tackling your hardest high-priority task first thing in the morning—drastically lowers stress."
                : completedCount > 0
                ? "Great consistency! Keep checking off completed items to maintain continuous momentum throughout the week."
                : "Get started by adding small, achievable tasks. Breaking complex goals into 15-minute subtasks increases task completion by over 300%."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
