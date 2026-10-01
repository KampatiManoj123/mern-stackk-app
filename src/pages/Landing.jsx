import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon, BrandLogo } from "../components/Icons";

const Landing = () => {
  const { user } = useAuth();
  const [demoTasks, setDemoTasks] = useState([
    { id: 1, title: "Review product roadmap and sprint goals", category: "Work", priority: "high", done: false },
    { id: 2, title: "Prepare weekly status update for team", category: "Work", priority: "medium", done: true },
    { id: 3, title: "30-minute cardio workout & hydration", category: "Health", priority: "medium", done: false },
    { id: 4, title: "Read 20 pages of System Design handbook", category: "Study", priority: "low", done: false },
  ]);

  const toggleDemoTask = (id) => {
    setDemoTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "calc(100vh - 64px)", overflow: "hidden" }}>
      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          padding: "80px 20px 60px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Glow pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "24px",
          }}
        >
          <Icon name="sparkles" size={15} />
          <span>Next-Generation Productivity Platform</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: "800",
            color: "var(--text-primary)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
            margin: "0 auto 20px",
          }}
        >
          Organize Chaos. <br />
          <span
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Accomplish Goals Every Single Day.
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "var(--text-secondary)",
            maxWidth: "680px",
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          A fast, modern workspace designed to turn overwhelming to-do lists into
          focused, scheduled achievements. Built for professionals, students, and creators.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "56px",
          }}
        >
          {user ? (
            <Link
              to="/dashboard"
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: "16px", borderRadius: "12px" }}
            >
              <span>Go to My Dashboard</span>
              <Icon name="arrow-right" size={18} />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "14px 28px", fontSize: "16px", borderRadius: "12px" }}
              >
                <span>Get Started Free</span>
                <Icon name="arrow-right" size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{ padding: "14px 28px", fontSize: "16px", borderRadius: "12px" }}
              >
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>

        {/* Interactive Live Demo Preview Box */}
        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(30, 64, 175, 0.15)",
            border: "1px solid #e2e8f0",
            padding: "28px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "16px",
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <BrandLogo size={28} />
              <div>
                <div style={{ fontWeight: "700", fontSize: "15px" }}>Interactive Preview</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Click checkboxes to experience the feel!
                </div>
              </div>
            </div>
            <span className="badge badge-tag" style={{ background: "#ecfdf5", color: "#059669" }}>
              Live Widget
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {demoTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleDemoTask(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: t.done ? "#f8fafc" : "#fff",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "6px",
                      border: t.done ? "none" : "2px solid #cbd5e1",
                      background: t.done ? "#10b981" : "#fff",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {t.done && <Icon name="check" size={14} />}
                  </div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      textDecoration: t.done ? "line-through" : "none",
                      color: t.done ? "var(--text-muted)" : "var(--text-primary)",
                    }}
                  >
                    {t.title}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className={`badge badge-${t.priority}`} style={{ fontSize: "11px" }}>
                    {t.priority}
                  </span>
                  <span className="badge badge-tag" style={{ fontSize: "11px" }}>
                    {t.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "40px auto 80px",
          padding: "0 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)" }}>
            Engineered for Maximum Clarity & Velocity
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginTop: "8px" }}>
            Every tool you need to stay organized, without bloated menus or distractions.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Feature 1 */}
          <div className="card-panel">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Icon name="dashboard" size={24} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              Smart Prioritization
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Sort through tasks instantly with customizable priority flags, category tags,
              and real-time keyword search.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-panel">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Icon name="calendar" size={24} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              Visual Calendar Schedule
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Plan out weeks in advance. Click any date to view scheduled items or queue up
              new work on the spot.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-panel">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#f5f3ff",
                color: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Icon name="chart" size={24} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              Productivity Intelligence
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Understand where your time goes. Measure completion velocity, priority distribution,
              and health indicators.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card-panel">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#fffbeb",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Icon name="shield" size={24} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              Reliable Cloud Sync
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Protected with encrypted JWT authentication and persistent MongoDB storage.
              Export your data anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
          color: "#fff",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "14px" }}>
            Ready to Take Control of Your Tasks?
          </h2>
          <p style={{ color: "#bfdbfe", fontSize: "16px", marginBottom: "28px" }}>
            Create your free account today and experience how effortless productivity can feel.
          </p>
          <Link
            to="/register"
            className="btn"
            style={{
              background: "#fff",
              color: "#1e40af",
              fontWeight: "700",
              padding: "14px 28px",
              fontSize: "16px",
              borderRadius: "12px",
            }}
          >
            Start Free Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
