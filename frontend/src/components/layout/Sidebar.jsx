import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  DashboardIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  DollarIcon,
  MegaphoneIcon,
  BuildingIcon,
  UsersIcon,
  PlusIcon,
  ClipboardIcon,
  LogOutIcon,
  XIcon,
} from "../ui/Icons";

const Sidebar = ({ collapsed = false, mobileOpen = false, onCloseMobile }) => {
  const { user, logoutUser } = useAuth();
  const role = user?.role;
  const sidebarClasses = [
    "sidebar",
    collapsed ? "collapsed" : "",
    mobileOpen ? "open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderLabel = (label) => <span className="sidebar-label">{label}</span>;

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={onCloseMobile}
      />
      <aside className={sidebarClasses}>
        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        >
          <XIcon size={18} />
        </button>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">HR</div>
          <div className="sidebar-brand-text sidebar-label">
            HRMS
            <span>Management System</span>
          </div>
        </div>

        <nav>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">
              <DashboardIcon size={18} />
            </span>
            {renderLabel("Dashboard")}
          </NavLink>
          <NavLink
            to="/my-profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">
              <UserIcon size={18} />
            </span>
            {renderLabel("My Profile")}
          </NavLink>

          <div className="sidebar-section sidebar-label">Self Service</div>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">
              <ClockIcon size={18} />
            </span>
            {renderLabel("Attendance")}
          </NavLink>
          <NavLink
            to="/leaves"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">
              <CalendarIcon size={18} />
            </span>
            {renderLabel("My Leaves")}
          </NavLink>
          <NavLink
            to="/payroll"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">
              <DollarIcon size={18} />
            </span>
            {renderLabel("Payroll")}
          </NavLink>
          <NavLink
            to="/announcements"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">
              <MegaphoneIcon size={18} />
            </span>
            {renderLabel("Announcements")}
          </NavLink>

          {role === "admin" && (
            <>
              <div className="sidebar-section sidebar-label">Admin</div>
              <NavLink
                to="/departments"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="icon">
                  <BuildingIcon size={18} />
                </span>
                {renderLabel("Departments")}
              </NavLink>
            </>
          )}

          {(role === "admin" || role === "hr") && (
            <>
              <div className="sidebar-section sidebar-label">Workforce</div>
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="icon">
                  <UsersIcon size={18} />
                </span>
                {renderLabel("Employees")}
              </NavLink>
              <div className="sidebar-section sidebar-label">Management</div>
              <NavLink
                to="/leave-management"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="icon">
                  <ClipboardIcon size={18} />
                </span>
                {renderLabel("Leave Requests")}
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">
                <PlusIcon size={18} />
              </span>
              {renderLabel("Register User")}
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user sidebar-label">
            <div className="sidebar-user-email">{user?.email}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
          <button
            onClick={logoutUser}
            className="sidebar-link"
            style={{ color: "#ef4444", width: "100%" }}
          >
            <span className="icon">
              <LogOutIcon size={18} />
            </span>
            {renderLabel("Sign Out")}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
