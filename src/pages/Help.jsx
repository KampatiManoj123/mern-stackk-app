import { useState } from "react";
import { Icon } from "../components/Icons";

const Help = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: "How does priority sorting work?",
      a: "Tasks can be assigned High, Medium, or Low priority. When sorting by priority, High priority tasks appear at the top so you can focus on high-impact items first.",
    },
    {
      q: "How do I schedule a task for a specific date?",
      a: "When creating or editing a task, pick a date in the 'Due Date' field. You can also open the Calendar page and click any day to schedule a task directly for that day.",
    },
    {
      q: "Can I backup or export my tasks?",
      a: "Yes! Navigate to Profile & Settings and click 'Export All Tasks (.json)'. It immediately downloads a clean JSON file of all your data.",
    },
    {
      q: "What is the recommended daily productivity routine?",
      a: "Review your tasks each morning, tackle 1-2 High priority items before noon (The 'Eat the Frog' technique), and check off completed items to maintain momentum.",
    },
    {
      q: "Is my data private and secure?",
      a: "Yes, every user has an isolated workspace tied to their unique MongoDB ID and JWT authentication token. Other users cannot view or edit your tasks.",
    },
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">
          <Icon name="help" size={28} />
          <span>Productivity Guide & FAQ</span>
        </h1>
        <p className="page-subtitle">
          Proven frameworks, workflow techniques, and answers to common questions.
        </p>
      </div>

      {/* Eisenhower Matrix Framework Section */}
      <div className="card-panel" style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "6px", color: "var(--text-primary)" }}>
          The Eisenhower Priority Matrix
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
          Organize your tasks according to urgency and importance to maximize daily efficiency.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Q1: Urgent & Important */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "#fef2f2",
              border: "1.5px solid #fecaca",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#b91c1c", fontWeight: "700", marginBottom: "6px" }}>
              <span className="badge badge-high">High Priority</span>
              <span>1. Do First</span>
            </div>
            <p style={{ fontSize: "13px", color: "#7f1d1d", lineHeight: "1.5" }}>
              Urgent and important deadlines, critical bugs, immediate client deliverables.
              Do these first thing in the morning.
            </p>
          </div>

          {/* Q2: Not Urgent, Important */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "#eff6ff",
              border: "1.5px solid #bfdbfe",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1d4ed8", fontWeight: "700", marginBottom: "6px" }}>
              <span className="badge badge-low">Schedule</span>
              <span>2. Schedule</span>
            </div>
            <p style={{ fontSize: "13px", color: "#1e3a8a", lineHeight: "1.5" }}>
              High-value goals without immediate panic: strategic planning, skill development,
              exercise. Put these on your Calendar!
            </p>
          </div>

          {/* Q3: Urgent, Not Important */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "#fffbeb",
              border: "1.5px solid #fde68a",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#b45309", fontWeight: "700", marginBottom: "6px" }}>
              <span className="badge badge-medium">Medium</span>
              <span>3. Delegate / Batch</span>
            </div>
            <p style={{ fontSize: "13px", color: "#78350f", lineHeight: "1.5" }}>
              Routine communications, non-critical meetings, administrative chores.
              Batch these together in the afternoon.
            </p>
          </div>

          {/* Q4: Not Urgent, Not Important */}
          <div
            style={{
              padding: "18px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontWeight: "700", marginBottom: "6px" }}>
              <span className="badge badge-tag">Low</span>
              <span>4. Eliminate</span>
            </div>
            <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>
              Time-wasters, excessive tinkering, low-leverage browsing. Remove or archive
              these to preserve mental focus.
            </p>
          </div>
        </div>
      </div>

      {/* Pomodoro Guide & Best Practices */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        <div className="card-panel">
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="clock" size={20} />
            <span>The Pomodoro Technique</span>
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
            1. Select one specific task from your TaskFlow dashboard.<br />
            2. Set a timer for <strong>25 minutes</strong> and work with zero distraction.<br />
            3. When the timer rings, take a <strong>5-minute rest</strong>.<br />
            4. After 4 sessions, reward yourself with a longer <strong>20-30 minute break</strong>.
          </p>
        </div>

        <div className="card-panel">
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="sparkles" size={20} />
            <span>Pro Tips for TaskFlow</span>
          </h3>
          <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
            <li>Keep task titles short and action-oriented (e.g., "Draft budget report").</li>
            <li>Assign categories like <strong>Work</strong>, <strong>Health</strong>, or <strong>Study</strong> to isolate contexts.</li>
            <li>Review the <strong>Analytics</strong> page every Friday to celebrate weekly wins.</li>
            <li>Use the <strong>Calendar</strong> to balance workloads across the month.</li>
          </ul>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="card-panel">
        <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "16px", color: "var(--text-primary)" }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: isOpen ? "#f8fafc" : "#fff",
                    border: "none",
                    textAlign: "left",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{faq.q}</span>
                  <Icon name={isOpen ? "close" : "chevron-down"} size={16} />
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "#fff",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      borderTop: "1px solid var(--border-light)",
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Help;
