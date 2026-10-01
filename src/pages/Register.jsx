import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const CheckLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="url(#reg_lg)" />
    <path
      d="M14 25l7 7 13-15"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="reg_lg" x1="0" y1="0" x2="48" y2="48">
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

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: "", color: "#e2e8f0" };
    if (pass.length < 6) return { score: 1, text: "Too short (min 6 chars)", color: "#ef4444" };
    const hasNum = /\d/.test(pass);
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);

    if (hasNum && hasLetter && hasSpecial && pass.length >= 8) {
      return { score: 3, text: "Strong password", color: "#10b981" };
    }
    if ((hasNum && hasLetter) || pass.length >= 8) {
      return { score: 2, text: "Medium strength", color: "#f59e0b" };
    }
    return { score: 1, text: "Weak password", color: "#ef4444" };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-page">
      {/* LEFT BRAND PANEL */}
      <div className="lp-left">
        <div className="lp-brand">
          <CheckLogo size={44} />
          <span>TaskFlow</span>
        </div>

        <h1 className="lp-headline">
          Build <i>•</i> <span>Focus</span> <i>•</i> Achieve More
        </h1>
        <p className="lp-sub">
          Join thousands of high performers managing tasks, hitting deadlines, and
          building lifelong productivity habits.
        </p>

        <ul className="lp-features">
          <li>
            <div className="lp-feat-icon">
              <Icon>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </Icon>
            </div>
            <div>
              <h4>Free Forever & Open</h4>
              <p>Everything you need to organize your personal and work life.</p>
            </div>
          </li>
          <li>
            <div className="lp-feat-icon">
              <Icon>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </Icon>
            </div>
            <div>
              <h4>Integrated Calendar & Analytics</h4>
              <p>Visualize deadlines and measure weekly accomplishment trends.</p>
            </div>
          </li>
          <li>
            <div className="lp-feat-icon">
              <Icon>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </Icon>
            </div>
            <div>
              <h4>Private & Encrypted</h4>
              <p>Your tasks and personal notes stay secure with encrypted sessions.</p>
            </div>
          </li>
        </ul>

        {/* Decorative Badge */}
        <div
          style={{
            marginTop: "48px",
            padding: "16px 20px",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            ★
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: "#fff" }}>
              Ready in under 30 seconds
            </div>
            <div style={{ fontSize: "13px", color: "#cbd8f5" }}>
              No credit card required. Get instant access.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT REGISTRATION FORM */}
      <div className="lp-right">
        <div className="lp-card">
          <div className="lp-card-logo">
            <CheckLogo size={60} />
          </div>
          <h2>Create Your Account</h2>
          <p className="lp-card-sub">Start organizing your productivity today</p>

          {error && <div className="lp-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <Icon>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </Icon>
              </span>
              <div className="lp-field-body">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Morgan"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <Icon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </Icon>
              </span>
              <div className="lp-field-body">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <Icon>
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </Icon>
              </span>
              <div className="lp-field-body">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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
                      <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9M6.5 7.6A17 17 0 0 0 2.5 12s3.5 6 9.5 6c1.4 0 2.7-.3 3.8-.8" />
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

            {/* Password Strength Meter */}
            {form.password && (
              <div
                style={{
                  margin: "-8px 0 14px",
                  textAlign: "left",
                  padding: "0 4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: "4px",
                    borderRadius: "2px",
                    background: "#e2e8f0",
                    overflow: "hidden",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      width: `${(strength.score / 3) * 100}%`,
                      background: strength.color,
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: "12px", color: strength.color, fontWeight: "600" }}>
                  {strength.text}
                </span>
              </div>
            )}

            {/* Confirm Password */}
            <div className="lp-field">
              <span className="lp-field-icon">
                <Icon>
                  <polyline points="20 6 9 17 4 12" />
                </Icon>
              </span>
              <div className="lp-field-body">
                <label htmlFor="reg-confirm-password">Confirm Password</label>
                <input
                  id="reg-confirm-password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="lp-btn" disabled={loading}>
              <Icon>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </Icon>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="lp-divider">
            <span>OR</span>
          </div>

          <p className="lp-register">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;