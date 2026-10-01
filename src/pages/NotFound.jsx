import { Link } from "react-router-dom";
import { Icon } from "../components/Icons";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        className="card-panel"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "48px 32px",
          borderRadius: "24px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            fontWeight: "900",
            lineHeight: 1,
            color: "var(--primary)",
            marginBottom: "12px",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px" }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "28px", lineHeight: "1.6" }}>
          The page you are looking for might have been moved, removed, or never existed. Let's get you back on track.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/dashboard" className="btn btn-primary">
            <Icon name="dashboard" size={16} />
            <span>Go to Dashboard</span>
          </Link>
          <Link to="/help" className="btn btn-secondary">
            <Icon name="help" size={16} />
            <span>Productivity Guide</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;