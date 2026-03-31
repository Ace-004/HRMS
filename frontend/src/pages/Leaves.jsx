import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getMyLeaves, applyLeave } from '../services/api';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [leaveType, setLeaveType] = useState('casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await getMyLeaves();
      if (res.success) setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await applyLeave({ leaveType, startDate, endDate });
      if (res.success) {
        setSuccess('Leave applied successfully!');
        setShowModal(false);
        setLeaveType('casual');
        setStartDate('');
        setEndDate('');
        fetchLeaves();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>My Leaves</h1>
          <p>View your leave history and apply for new leaves</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Apply Leave</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {leaves.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📅</div>
            <p>No leave records found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-dark)', textTransform: 'capitalize' }}>
                      {leave.leaveType}
                    </td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${leave.status}`}>{leave.status}</span></td>
                    <td>{new Date(leave.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Apply for Leave</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label>Leave Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                  <option value="casual">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Leaves;
