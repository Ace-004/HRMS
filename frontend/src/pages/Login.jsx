import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  UsersIcon,
  ShieldIcon,
  ArrowRightIcon,
} from "../components/ui/Icons";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="portal-wrapper">
      <div className="portal-logo">HR</div>
      <h1 className="portal-title">HRMS Portal</h1>
      <p className="portal-subtitle">Human Resource Management System</p>

      <div className="portal-cards">
        {/* Employee Card */}
        <div className="portal-card">
          <div className="portal-card-header">
            <span className="portal-card-label employee">Employee Portal</span>
            <span className="portal-card-badge">User Access</span>
          </div>
          <div className="portal-card-icon employee">
            <UserIcon size={24} />
          </div>
          <h3>Employee Login</h3>
          <p>
            Login using your Employee ID and password to access your profile,
            leave details, attendance, and salary records.
          </p>
          <div className="portal-card-tags">
            <span className="portal-card-tag">Attendance history</span>
            <span className="portal-card-tag">Leave requests</span>
          </div>
          <button
            className="portal-card-btn employee"
            onClick={() => navigate("/auth/employee")}
          >
            Login Now <ArrowRightIcon size={16} />
          </button>
        </div>

        {/* HR Card */}
        <div className="portal-card">
          <div className="portal-card-header">
            <span className="portal-card-label hr">Workforce Management</span>
            <span className="portal-card-badge">HR Access</span>
          </div>
          <div className="portal-card-icon hr">
            <UsersIcon size={24} />
          </div>
          <h3>HR Login</h3>
          <p>
            Access for HR personnel to manage employees, approve leave requests,
            track attendance, and handle recruitment.
          </p>
          <div className="portal-card-tags">
            <span className="portal-card-tag">Recruitment flow</span>
            <span className="portal-card-tag">People operations</span>
          </div>
          <button
            className="portal-card-btn hr"
            onClick={() => navigate("/auth/hr")}
          >
            Login Now <ArrowRightIcon size={16} />
          </button>
        </div>

        {/* Admin Card */}
        <div className="portal-card">
          <div className="portal-card-header">
            <span className="portal-card-label admin">System Control</span>
            <span className="portal-card-badge">Full Access</span>
          </div>
          <div className="portal-card-icon admin">
            <ShieldIcon size={24} />
          </div>
          <h3>Admin Login</h3>
          <p>
            Full system access for administrators. Manage users, departments,
            payroll analytics, and system-wide settings.
          </p>
          <div className="portal-card-tags">
            <span className="portal-card-tag">Access policies</span>
            <span className="portal-card-tag">Payroll analytics</span>
          </div>
          <button
            className="portal-card-btn admin"
            onClick={() => navigate("/auth/admin")}
          >
            Login Now <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>

      <p className="portal-footer">
        © {new Date().getFullYear()} HRMS Portal. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
