import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const role = user?.role;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">HR</div>
        <div className="sidebar-brand-text">
          HRMS
          <span>Management System</span>
        </div>
      </div>

      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/my-profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">👤</span> My Profile
        </NavLink>

        <div className="sidebar-section">Self Service</div>
        <NavLink to="/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">🕒</span> Attendance
        </NavLink>
        <NavLink to="/leaves" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">📅</span> My Leaves
        </NavLink>
        <NavLink to="/payroll" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">💰</span> Payroll
        </NavLink>
        <NavLink to="/announcements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">📢</span> Announcements
        </NavLink>

        {role === 'admin' && (
          <>
            <div className="sidebar-section">Admin</div>
            <NavLink to="/departments" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="icon">🏢</span> Departments
            </NavLink>
          </>
        )}

        {(role === 'admin' || role === 'hr') && (
          <>
            <div className="sidebar-section">Workforce</div>
            <NavLink to="/employees" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="icon">👥</span> Employees
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="icon">➕</span> Register User
            </NavLink>
            <div className="sidebar-section">Management</div>
            <NavLink to="/leave-management" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="icon">📋</span> Leave Requests
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-email">{user?.email}</div>
          <div className="sidebar-user-role">{role}</div>
        </div>
        <button onClick={logoutUser} className="sidebar-link" style={{ color: '#ef4444', width: '100%' }}>
          <span className="icon">🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
