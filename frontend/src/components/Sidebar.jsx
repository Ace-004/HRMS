import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  DashboardIcon,
  ClockIcon,
  CalendarIcon,
  DollarIcon,
  UsersIcon,
  BuildingIcon,
  ClipboardIcon,
  PlusIcon,
  MegaphoneIcon,
  LogOutIcon,
} from "./ui/Icons";

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const isAdmin = user?.role === "admin";
  const isHr = user?.role === "hr";
  const isManager = isAdmin || isHr;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        HRMS
        <span>Human Resource System</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">
            <DashboardIcon size={18} />
          </span>{" "}
          Dashboard
        </NavLink>

        <div className="sidebar-section-title">Self Service</div>
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">
            <ClockIcon size={18} />
          </span>{" "}
          Attendance
        </NavLink>
        <NavLink
          to="/leaves"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">
            <CalendarIcon size={18} />
          </span>{" "}
          My Leaves
        </NavLink>
        <NavLink
          to="/payroll"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">
            <DollarIcon size={18} />
          </span>{" "}
          Payroll
        </NavLink>

        {isManager && (
          <>
            <div className="sidebar-section-title">Management</div>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">
                <UsersIcon size={18} />
              </span>{" "}
              Employees
            </NavLink>
            <NavLink
              to="/departments"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">
                <BuildingIcon size={18} />
              </span>{" "}
              Departments
            </NavLink>
            <NavLink
              to="/leave-management"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">
                <ClipboardIcon size={18} />
              </span>{" "}
              Leave Requests
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <div className="sidebar-section-title">Admin</div>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">
                <PlusIcon size={18} />
              </span>{" "}
              Register User
            </NavLink>
          </>
        )}

        <div className="sidebar-section-title">General</div>
        <NavLink
          to="/announcements"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">
            <MegaphoneIcon size={18} />
          </span>{" "}
          Announcements
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div style={{ padding: "0 0.75rem", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {user?.email}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            {user?.role}
          </div>
        </div>
        <button
          onClick={logoutUser}
          className="sidebar-link"
          style={{ color: "var(--error)" }}
        >
          <span className="icon">
            <LogOutIcon size={18} />
          </span>{" "}
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
