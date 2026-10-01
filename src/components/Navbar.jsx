import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon, BrandLogo } from "./Icons";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
    <header className="navbar-wrap">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand">
          <BrandLogo size={34} />
          <span>TaskFlow</span>
          <span className="brand-badge">Pro</span>
        </Link>

        {/* Navigation Links for Authenticated Users */}
        {user && (
          <nav className={`navbar-nav ${mobileMenuOpen ? "open" : ""}`}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <Icon name="dashboard" size={17} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <Icon name="calendar" size={17} />
              <span>Calendar</span>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <Icon name="chart" size={17} />
              <span>Analytics</span>
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <Icon name="help" size={17} />
              <span>Guide & FAQ</span>
            </NavLink>
          </nav>
        )}

        {/* Right Section */}
        <div className="navbar-right">
          {user ? (
            <div className="dropdown-wrap" ref={dropdownRef}>
              <button
                type="button"
                className="user-profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <div className="avatar-circle">{getInitials(user.name)}</div>
                <span className="user-name-label">{user.name}</span>
                <Icon name="chevron-down" size={14} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{user.name}</div>
                    <div className="dropdown-user-email">{user.email}</div>
                  </div>

                  <Link to="/profile" className="dropdown-item">
                    <Icon name="user" size={16} />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link to="/analytics" className="dropdown-item">
                    <Icon name="chart" size={16} />
                    <span>Productivity Insights</span>
                  </Link>

                  <Link to="/help" className="dropdown-item">
                    <Icon name="help" size={16} />
                    <span>Productivity Guide</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item danger"
                  >
                    <Icon name="logout" size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          {user && (
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <Icon name={mobileMenuOpen ? "close" : "dashboard"} size={22} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
