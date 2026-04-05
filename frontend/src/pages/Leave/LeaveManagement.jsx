import React, { useState, useEffect } from "react";
import { getAllLeaves, updateLeaveStatus } from "../../services/api";
import { ClipboardIcon } from "../../components/ui/Icons";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await getAllLeaves();
      if (res.success) setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Leave Requests</h1>
          <p>Review and manage all employee leave applications</p>
        </div>
      </div>

      <div className="card">
        {leaves.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <ClipboardIcon size={34} />
            </div>
            <p>No leave requests found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td
                      data-label="Employee"
                      style={{ fontWeight: 600, color: "var(--text-dark)" }}
                    >
                      {leave.employeeId?.firstName ||
                        leave.employeeId?.email ||
                        "—"}
                    </td>
                    <td
                      data-label="Type"
                      style={{ textTransform: "capitalize" }}
                    >
                      {leave.leaveType}
                    </td>
                    <td data-label="Start">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td data-label="End">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td data-label="Status">
                      <span className={`badge badge-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td data-label="Actions">
                      {leave.status === "pending" ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "0.4rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAction(leave._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleAction(leave._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default LeaveManagement;
