import React, { useState, useEffect } from 'react';
import { getEmployees, getAllLeaves, getAnnouncements } from '../../services/api';

const HRDashboard = () => {
  const [stats, setStats] = useState({ employees: 0, pendingLeaves: 0, announcements: 0 });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, leaveRes, annRes] = await Promise.allSettled([
          getEmployees(),
          getAllLeaves(),
          getAnnouncements(),
        ]);

        setStats({
          employees: empRes.status === 'fulfilled' && empRes.value.success ? empRes.value.data.length : 0,
          pendingLeaves: leaveRes.status === 'fulfilled' && leaveRes.value.success
            ? leaveRes.value.data.filter(l => l.status === 'pending').length : 0,
          announcements: annRes.status === 'fulfilled' && annRes.value.success ? annRes.value.data.length : 0,
        });

        if (annRes.status === 'fulfilled' && annRes.value.success) {
          setRecentAnnouncements(annRes.value.data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>HR Dashboard</h1>
          <p>Workforce management and employee operations</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <div className="value">{stats.employees}</div>
            <div className="label">Total Employees</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div className="stat-info">
            <div className="value">{stats.pendingLeaves}</div>
            <div className="label">Pending Leaves</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📢</div>
          <div className="stat-info">
            <div className="value">{stats.announcements}</div>
            <div className="label">Announcements</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Recent Announcements</h3>
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

export default HRDashboard;
