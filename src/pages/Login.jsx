import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const CheckLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="url(#lg)" />
    <path
      d="M14 25l7 7 13-15"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48">
        <stop stopColor="#3b82f6" />
        <stop offset="1" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
  </svg>
);

const Icon = ({ children }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-page">
      {/* LEFT PANEL */}
      <div className="lp-left">
        <div className="lp-brand">
          <CheckLogo size={44} />
          <span>Task Manager</span>
        </div>

        <h1 className="lp-headline">
          Plan <i>•</i> <span>Organize</span> <i>•</i> Get Things Done
        </h1>
        <p className="lp-sub">
          Keep your tasks, goals and progress all in one place.
          <br />
          Work smarter, not harder.
        </p>

        <ul className="lp-features">
          <li>
            <div className="lp-feat-icon">
              <Icon>
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l3 3 5-6" />
              </Icon>
            </div>
            <div>
              <h4>Manage Tasks</h4>
              <p>Stay organized and never miss important tasks.</p>
            </div>
          </li>
          <li>
            <div className="lp-feat-icon">
              <Icon>
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </Icon>
            </div>
            <div>
              <h4>Track Progress</h4>
              <p>See your work, measure your growth.</p>
            </div>
          </li>
          <li>
            <div className="lp-feat-icon">
              <Icon>
                <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" />
              </Icon>
            </div>
            <div>
              <h4>Be More Productive</h4>
              <p>Small steps create big results.</p>
            </div>
          </li>
        </ul>

        {/* Illustration */}
        <svg className="lp-illustration" viewBox="0 0 420 300" fill="none">
          <ellipse cx="220" cy="270" rx="190" ry="24" fill="#0b2a6b" opacity=".6" />
          {/* back folder */}
          <rect x="40" y="70" width="170" height="200" rx="16" fill="#2563eb" transform="rotate(-8 125 170)" />
          {/* paper */}
          <rect x="70" y="40" width="190" height="220" rx="16" fill="#f1f5ff" transform="rotate(-8 165 150)" />
          <g transform="rotate(-8 165 150)">
            <rect x="100" y="70" width="110" height="9" rx="4.5" fill="#bfd0f5" />
            <rect x="100" y="115" width="26" height="26" rx="6" fill="#2563eb" />
            <path d="M107 128l5 5 8-10" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="138" y="122" width="90" height="8" rx="4" fill="#bfd0f5" />
            <rect x="100" y="158" width="26" height="26" rx="6" stroke="#bfd0f5" strokeWidth="3" />
            <rect x="138" y="165" width="80" height="8" rx="4" fill="#bfd0f5" />
            <rect x="100" y="200" width="26" height="26" rx="6" stroke="#bfd0f5" strokeWidth="3" />
            <rect x="138" y="207" width="85" height="8" rx="4" fill="#bfd0f5" />
          </g>
          {/* plant */}
          <path d="M295 150c-20-30-8-60 10-72 14 26 12 52-10 72z" fill="#14b8a6" />
          <path d="M300 152c10-30 34-40 52-36-8 26-28 42-52 36z" fill="#0d9488" />
          <path d="M298 150c-26-10-38-30-36-50 24 6 38 26 36 50z" fill="#2dd4bf" />
          <path d="M270 175h68l-8 44h-52z" fill="#e2e8f0" />
          <rect x="266" y="168" width="76" height="14" rx="7" fill="#f8fafc" />
          {/* mug */}
          <rect x="300" y="215" width="80" height="62" rx="14" fill="#1e40af" />
          <ellipse cx="340" cy="217" rx="38" ry="9" fill="#0b1f52" />
          <path d="M380 235c20 0 22 26 0 28" stroke="#1e40af" strokeWidth="9" strokeLinecap="round" />
        </svg>
      </div>

      {/* RIGHT PANEL */}
      <div className="lp-right">
        <div className="lp-card">
          <div className="lp-card-logo">
            <CheckLogo size={64} />
          </div>
          <h2>Welcome Back</h2>
          <p className="lp-card-sub">Login to your Task Manager account</p>

          {error && <div className="lp-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="lp-field">
              <span className="lp-field-icon">
                <Icon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </Icon>
              </span>
              <div className="lp-field-body">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="lp-field">
              <span className="lp-field-icon">
                <Icon>
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V8a4 4 0 018 0v3" />
                </Icon>
              </span>
              <div className="lp-field-body">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button
                type="button"
                className="lp-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon>
                  {showPassword ? (
                    <>
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.1A9.8 9.8 0 0112 6c6 0 9.5 6 9.5 6a17 17 0 01-3.2 3.9M6.5 7.6A17 17 0 002.5 12s3.5 6 9.5 6c1.4 0 2.7-.3 3.8-.8" />
                    </>
                  ) : (
                    <>
                      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </Icon>
              </button>
            </div>

            <button type="submit" className="lp-btn" disabled={loading}>
              <Icon>
                <path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" />
                <path d="M10 8l4 4-4 4M14 12H3" />
              </Icon>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="lp-divider">
            <span>OR</span>
          </div>

          <p className="lp-register">
            No account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;