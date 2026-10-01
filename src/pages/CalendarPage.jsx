import { useState, useEffect } from "react";
import api from "../api/axios";
import { Icon } from "../components/Icons";

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [quickTitle, setQuickTitle] = useState("");

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (_err) {
      console.error("Could not load tasks for calendar", _err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleToggle = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAddForDate = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      // Format selected date as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;

      const res = await api.post("/tasks", {
        title: quickTitle.trim(),
        dueDate: formatted,
        priority: "medium",
        category: "General",
      });
      setTasks([res.data, ...tasks]);
      setQuickTitle("");
    } catch (_err) {
      alert("Failed to add scheduled task");
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px 0" }}>
        <h3>Loading your calendar...</h3>
      </div>
    );
  }

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Prev month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    calendarDays.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month padding days to fill 35 or 42 grid cells
  const remainingCells = 42 - calendarDays.length;
  for (let n = 1; n <= remainingCells; n++) {
    calendarDays.push({
      date: new Date(year, month + 1, n),
      isCurrentMonth: false,
    });
  }

  // Format date helper
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getTasksForDate = (date) => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const tDate = new Date(t.dueDate);
      return isSameDay(tDate, date);
    });
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const unscheduledTasks = tasks.filter((t) => !t.dueDate && !t.completed);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 className="page-title">
            <Icon name="calendar" size={28} />
            <span>Task Calendar & Schedule</span>
          </h1>
          <p className="page-subtitle">
            Plan your timeline, track upcoming deadlines, and schedule upcoming work.
          </p>
        </div>

        {/* Month Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleToday}>
            Today
          </button>
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <Icon name="chevron-left" size={16} />
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
          <span style={{ fontSize: "18px", fontWeight: "800", minWidth: "150px", textAlign: "right" }}>
            {monthNames[month]} {year}
          </span>
        </div>
      </div>

      {/* Main Grid: Calendar Left, Agenda Panel Right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Calendar Card */}
        <div className="card-panel" style={{ padding: "16px" }}>
          {/* Day of Week Headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              textAlign: "center",
              fontWeight: "700",
              fontSize: "12px",
              color: "var(--text-secondary)",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Days Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "4px",
              marginTop: "8px",
            }}
          >
            {calendarDays.map((item, idx) => {
              const dayTasks = getTasksForDate(item.date);
              const isToday = isSameDay(item.date, new Date());
              const isSelected = isSameDay(item.date, selectedDate);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(item.date)}
                  style={{
                    minHeight: "78px",
                    padding: "6px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: isSelected
                      ? "#eff6ff"
                      : isToday
                      ? "#f8fafc"
                      : "transparent",
                    border: isSelected
                      ? "2px solid #3b82f6"
                      : isToday
                      ? "1.5px solid #cbd5e1"
                      : "1px solid transparent",
                    opacity: item.isCurrentMonth ? 1 : 0.35,
                    transition: "var(--transition)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: isToday || isSelected ? "700" : "500",
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: isToday ? "var(--primary)" : "transparent",
                        color: isToday ? "#fff" : "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.date.getDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: "var(--primary)",
                          background: "#dbeafe",
                          padding: "1px 5px",
                          borderRadius: "10px",
                        }}
                      >
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task indicator dots or micro pills */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t._id}
                        style={{
                          fontSize: "10px",
                          fontWeight: "600",
                          padding: "1px 4px",
                          borderRadius: "3px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          background: t.completed ? "#e2e8f0" : "#dbeafe",
                          color: t.completed ? "#64748b" : "#1e40af",
                          textDecoration: t.completed ? "line-through" : "none",
                        }}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "600" }}>
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Agenda Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Day Detail Card */}
          <div className="card-panel">
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px", color: "var(--text-primary)" }}>
              Agenda for {selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" })}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "task" : "tasks"} scheduled
            </p>

            {/* Quick Add for this date */}
            <form onSubmit={handleQuickAddForDate} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "13px" }}
                  placeholder="Schedule task for this day..."
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Add
                </button>
              </div>
            </form>

            {/* Tasks list */}
            {selectedDateTasks.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                No tasks scheduled for this day.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedDateTasks.map((task) => (
                  <div
                    key={task._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: task.completed ? "#f8fafc" : "#ffffff",
                      border: "1px solid var(--border-light)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleToggle(task)}
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "4px",
                          border: "1.5px solid #cbd5e1",
                          background: task.completed ? "var(--success)" : "#fff",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          padding: 0,
                          flexShrink: 0,
                        }}
                      >
                        {task.completed && <Icon name="check" size={12} />}
                      </button>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          textDecoration: task.completed ? "line-through" : "none",
                          color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className={`badge badge-${task.priority || "medium"}`} style={{ fontSize: "10px", padding: "2px 6px" }}>
                      {task.priority || "med"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unscheduled Tasks Drawer */}
          {unscheduledTasks.length > 0 && (
            <div className="card-panel">
              <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: "var(--text-primary)" }}>
                Unscheduled Tasks ({unscheduledTasks.length})
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                Tasks without a set due date
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
                {unscheduledTasks.slice(0, 5).map((ut) => (
                  <div
                    key={ut._id}
                    style={{
                      fontSize: "13px",
                      padding: "6px 10px",
                      background: "var(--bg-subtle)",
                      borderRadius: "6px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ut.title}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: "600" }}>{ut.category || "General"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
