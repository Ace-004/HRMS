import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeftIcon, MenuIcon } from "../ui/Icons";

const Navbar = ({
  sidebarCollapsed,
  onToggleSidebar,
  onToggleMobileSidebar,
}) => {
  const { user } = useAuth();
  const initial = user?.email?.charAt(0)?.toUpperCase() || "U";
  const role = user?.role || "employee";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-icon-btn mobile-only"
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation"
        >
          <MenuIcon size={18} />
        </button>
        <button
          type="button"
          className={`navbar-icon-btn desktop-only ${sidebarCollapsed ? "collapsed" : ""}`}
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeftIcon size={18} />
        </button>
        <div className="navbar-title">
          Welcome, {user?.email?.split("@")[0] || "User"}
        </div>
      </div>
      <div className="navbar-right">
        <span className={`badge badge-${role}`}>{role}</span>
        <div className="navbar-avatar">{initial}</div>
      </div>
    </header>
  );
};

export default Navbar;
