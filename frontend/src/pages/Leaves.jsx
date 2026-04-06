import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getMyLeaves, applyLeave } from "../services/api";
import { CalendarIcon, PlusIcon } from "../components/ui/Icons";
import { toast } from "react-toastify";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [leaveType, setLeaveType] = useState("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();
      if (res.success) setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const leaveSummary = {
    total: leaves.length,
    pending: leaves.filter((leave) => leave.status === "pending").length,
    approved: leaves.filter((leave) => leave.status === "approved").length,
    rejected: leaves.filter((leave) => leave.status === "rejected").length,
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const res = await applyLeave({ leaveType, startDate, endDate });
      if (res.success) {
        toast.success("Leave applied successfully!");
        setShowModal(false);
        setLeaveType("casual");
        setStartDate("");
        setEndDate("");
        fetchLeaves();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>My Leaves</h1>
          <p>View your leave history and apply for new leaves</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusIcon size={16} /> Apply Leave
        </button>
      </div>

      <div className="stats-grid leaves-stats">
        <div className="stat-card">
          <div className="stat-icon purple">
            <CalendarIcon size={22} />
          </div>
          <div className="stat-info">
            <div className="value">{leaveSummary.total}</div>
            <div className="label">Total Requests</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <CalendarIcon size={22} />
          </div>
          <div className="stat-info">
            <div className="value">{leaveSummary.pending}</div>
            <div className="label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <CalendarIcon size={22} />
          </div>
          <div className="stat-info">
            <div className="value">{leaveSummary.approved}</div>
            <div className="label">Approved</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <CalendarIcon size={22} />
          </div>
          <div className="stat-info">
            <div className="value">{leaveSummary.rejected}</div>
            <div className="label">Rejected</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-heading">
          <div>
            <h3>Leave History</h3>
            <p>Recent leave requests and their current status</p>
          </div>
        </div>
        {leaves.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <CalendarIcon size={34} />
            </div>
            <p>No leave records found</p>
          </div>
        ) : (
          <div className="leave-history-grid">
            {leaves.map((leave) => (
              <article className="leave-history-card" key={leave._id}>
                <div className="leave-history-card-top">
                  <div>
                    <div className="leave-history-type">{leave.leaveType}</div>
                    <div className="leave-history-dates">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge badge-${leave.status}`}>
                    {leave.status}
                  </span>
                </div>

                <div className="leave-history-meta">
                  <div>
                    <span className="leave-meta-label">Applied On</span>
                    <span className="leave-meta-value">
                      {new Date(leave.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="leave-meta-label">Duration</span>
                    <span className="leave-meta-value">
                      {Math.max(
                        1,
                        Math.ceil(
                          (new Date(leave.endDate) -
                            new Date(leave.startDate)) /
                            (1000 * 60 * 60 * 24),
                        ) + 1,
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for Leave</h2>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="casual">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Leaves;
