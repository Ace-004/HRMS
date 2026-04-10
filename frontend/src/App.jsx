import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// Public pages
import PortalLogin from "./pages/Login";
import AuthLogin from "./pages/Auth/Login";

// Protected pages
import Dashboard from "./pages/Dashboard";
import CompleteProfile from "./pages/CompleteProfile";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import LeaveManagement from "./pages/LeaveManagement";
import Payroll from "./pages/Payroll";
import Announcements from "./pages/Announcements";
import Register from "./pages/Register";
import EmployeeDetail from "./pages/Employees/EmployeeDetail";
import MyProfile from "./pages/Employees/MyProfile";

// Route guards
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// Forces user to complete profile first
const ProfileRequiredRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (!user.profileCompleted) return <Navigate to="/complete-profile" />;
  return children;
};

// Admin + HR only (for leave management)
const AdminOrHrRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin" && user.role !== "hr")
    return <Navigate to="/dashboard" />;
  return children;
};

// Admin only (employees list, departments, register)
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
};

const App = () => {
  return (
    <>
      <Routes>
        {/* Public - Portal & Auth */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <PortalLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/:role"
          element={
            <PublicRoute>
              <AuthLogin />
            </PublicRoute>
          }
        />

        {/* Complete Profile (any logged-in user whose profile is not complete) */}
        <Route
          path="/complete-profile"
          element={
            <PrivateRoute>
              <CompleteProfile />
            </PrivateRoute>
          }
        />

        {/* Self-Service (profile must be completed) */}
        <Route
          path="/dashboard"
          element={
            <ProfileRequiredRoute>
              <Dashboard />
            </ProfileRequiredRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProfileRequiredRoute>
              <MyProfile />
            </ProfileRequiredRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProfileRequiredRoute>
              <Attendance />
            </ProfileRequiredRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <ProfileRequiredRoute>
              <Leaves />
            </ProfileRequiredRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProfileRequiredRoute>
              <Payroll />
            </ProfileRequiredRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProfileRequiredRoute>
              <Announcements />
            </ProfileRequiredRoute>
          }
        />

        {/* Admin only (GET /departments is admin-only in backend for creation) */}
        <Route
          path="/departments"
          element={
            <AdminRoute>
              <Departments />
            </AdminRoute>
          }
        />

        {/* Admin + HR (leave management and workforce) */}
        <Route
          path="/leave-management"
          element={
            <AdminOrHrRoute>
              <LeaveManagement />
            </AdminOrHrRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <AdminOrHrRoute>
              <Employees />
            </AdminOrHrRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <AdminOrHrRoute>
              <EmployeeDetail />
            </AdminOrHrRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AdminRoute>
              <Register />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
    </>
  );
};

export default App;
