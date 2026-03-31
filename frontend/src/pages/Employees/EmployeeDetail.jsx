import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getEmployeeById, getEmployeeLeaves, getEmployeeAttendance } from '../../services/api';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [empRes, leaveRes, attRes] = await Promise.all([
          getEmployeeById(id),
          getEmployeeLeaves(id),
          getEmployeeAttendance(id)
        ]);
        
        if (empRes.success) setEmployee(empRes.data);
        if (leaveRes.success) setLeaves(leaveRes.data);
        if (attRes.success) setAttendance(attRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <Layout><div className="empty-state"><p>Loading details...</p></div></Layout>;
  }

  if (error || !employee) {
    return (
      <Layout>
        <div className="alert alert-error">{error || 'Employee not found'}</div>
        <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={() => navigate('/employees')}>← Back to Directory</button>
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
        <button className="btn btn-ghost" onClick={() => navigate('/employees')}>← Back</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card">
          <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Profile Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="stat-info">
              <div className="label">Full Name</div>
              <div className="value" style={{ fontSize: '1rem' }}>{employee.firstName} {employee.lastName}</div>
            </div>
            <div className="stat-info">
              <div className="label">Designation</div>
              <div className="value" style={{ fontSize: '1rem' }}>{employee.designation}</div>
            </div>
            <div className="stat-info">
              <div className="label">Salary</div>
              <div className="value" style={{ fontSize: '1rem' }}>${employee.salary?.toLocaleString() || 'N/A'}</div>
            </div>
            <div className="stat-info">
              <div className="label">Joined</div>
              <div className="value" style={{ fontSize: '1rem' }}>{new Date(employee.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Leaves Card */}
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Leave History</h3>
            {leaves.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No leave records found.</p>
            ) : (
              <div className="table-wrapper">
                <table style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave._id}>
                        <td style={{ textTransform: 'capitalize' }}>{leave.leaveType}</td>
                        <td>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${leave.status}`}>{leave.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Attendance Card */}
          <div className="card">
            <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Recent Attendance</h3>
            {attendance.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No attendance records found.</p>
            ) : (
              <div className="table-wrapper">
                <table style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Hrs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.slice(0, 10).map((record) => (
                      <tr key={record._id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                        <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}</td>
                        <td>{record.workingHours ? `${record.workingHours} h` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetail;
