import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyLeaves, getAnnouncements } from '../../services/api';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [leaveStats, setLeaveStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaveRes, annRes] = await Promise.allSettled([
          getMyLeaves(),
          getAnnouncements(),
        ]);

        if (leaveRes.status === 'fulfilled' && leaveRes.value.success) {
          const leaves = leaveRes.value.data;
          setLeaveStats({
            total: leaves.length,
            pending: leaves.filter(l => l.status === 'pending').length,
            approved: leaves.filter(l => l.status === 'approved').length,
          });
        }

        if (annRes.status === 'fulfilled' && annRes.value.success) {
          setRecentAnnouncements(annRes.value.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Your personal workspace overview</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">👤</div>
          <div className="stat-info">
            <div className="value">{user?.role?.toUpperCase()}</div>
            <div className="label">Your Role</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info">
            <div className="value">{leaveStats.total}</div>
            <div className="label">Total Leaves</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div className="stat-info">
            <div className="value">{leaveStats.pending}</div>
            <div className="label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <div className="value">{leaveStats.approved}</div>
            <div className="label">Approved</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Announcements</h3>
        {recentAnnouncements.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📢</div>
            <p>No announcements yet</p>
          </div>
        ) : (
          recentAnnouncements.map((ann) => (
            <div className="announcement-item" key={ann._id}>
              <div>
                <h4>{ann.title}</h4>
                <p>{ann.content}</p>
              </div>
              <span className="announcement-date">{new Date(ann.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default EmployeeDashboard;
