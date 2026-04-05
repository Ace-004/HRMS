import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  getEmployeeById,
  getEmployeeLeaves,
  getEmployeeAttendance,
} from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [empRes, leaveRes, attRes] = await Promise.all([
          getEmployeeById(id),
          getEmployeeLeaves(id),
          getEmployeeAttendance(id),
        ]);

        if (empRes.success) setEmployee(empRes.data);
        if (leaveRes.success) setLeaves(leaveRes.data);
        if (attRes.success) setAttendance(attRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="empty-state">
          <LoadingSpinner label="Loading details..." size={18} />
        </div>
      </Layout>
    );
  }

  if (error || !employee) {
    return (
      <Layout>
        <div className="alert alert-error">{error || "Employee not found"}</div>
        <button
          className="btn btn-ghost"
          style={{ marginTop: "1rem" }}
          onClick={() => navigate("/employees")}
        >
          ← Back to Directory
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Employee Details</h1>
          <p>View complete profile, attendance, and leave history</p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => navigate("/employees")}
        >
          ← Back
        </button>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}
      >
        {/* Profile Card */}
        <div className="card">
          <h3
            style={{
              fontWeight: 700,
              color: "var(--text-dark)",
              marginBottom: "1rem",
            }}
          >
            Profile Information
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <div className="stat-info">
              <div className="label">Full Name</div>
              <div className="value" style={{ fontSize: "1rem" }}>
                {employee.firstName} {employee.lastName}
              </div>
            </div>
            <div className="stat-info">
              <div className="label">Designation</div>
              <div className="value" style={{ fontSize: "1rem" }}>
                {employee.designation}
              </div>
            </div>
            <div className="stat-info">
              <div className="label">Salary</div>
              <div className="value" style={{ fontSize: "1rem" }}>
                ${employee.salary?.toLocaleString() || "N/A"}
              </div>
            </div>
            <div className="stat-info">
              <div className="label">Joined</div>
              <div className="value" style={{ fontSize: "1rem" }}>
                {new Date(employee.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="employee-detail-panels">
          {/* Leaves Card */}
          <div className="card">
            <h3
              style={{
                fontWeight: 700,
                color: "var(--text-dark)",
                marginBottom: "1rem",
              }}
            >
              Leave History
            </h3>
            {leaves.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>
                No leave records found.
              </p>
            ) : (
              <div className="detail-record-list">
                {leaves.map((leave) => (
                  <article className="detail-record-card" key={leave._id}>
                    <div className="detail-record-top">
                      <div>
                        <div className="detail-record-title">
                          {leave.leaveType}
                        </div>
                        <div className="detail-record-subtitle">
                          {new Date(leave.startDate).toLocaleDateString()} -{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`badge badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </div>
                    <div className="detail-record-meta">
                      <div>
                        <span className="leave-meta-label">Start</span>
                        <span className="leave-meta-value">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="leave-meta-label">End</span>
                        <span className="leave-meta-value">
                          {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Attendance Card */}
          <div className="card">
            <h3
              style={{
                fontWeight: 700,
                color: "var(--text-dark)",
                marginBottom: "1rem",
              }}
            >
              Recent Attendance
            </h3>
            {attendance.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>
                No attendance records found.
              </p>
            ) : (
              <div className="detail-record-list">
                {attendance.slice(0, 10).map((record) => (
                  <article className="detail-record-card" key={record._id}>
                    <div className="detail-record-top">
                      <div>
                        <div className="detail-record-title">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <div className="detail-record-subtitle">
                          Daily attendance summary
                        </div>
                      </div>
                      <span className="badge badge-active">
                        {record.workingHours ? `${record.workingHours} h` : "—"}
                      </span>
                    </div>
                    <div className="detail-record-meta">
                      <div>
                        <span className="leave-meta-label">Check In</span>
                        <span className="leave-meta-value">
                          {record.checkIn
                            ? new Date(record.checkIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="leave-meta-label">Check Out</span>
                        <span className="leave-meta-value">
                          {record.checkOut
                            ? new Date(record.checkOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetail;
