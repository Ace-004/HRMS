import React, { useState } from 'react';
import { checkIn, checkOut } from '../../services/api';

const AttendanceTracker = () => {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState('');

  const handleCheckIn = async () => {
    setError('');
    setStatus('');
    setLoading('in');
    try {
      const res = await checkIn();
      if (res.success) {
        setStatus('Checked in successfully!');
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading('');
    }
  };

  const handleCheckOut = async () => {
    setError('');
    setStatus('');
    setLoading('out');
    try {
      const res = await checkOut();
      if (res.success) {
        setStatus(`Checked out! Working hours: ${res.data.workingHours || '—'} hrs`);
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading('');
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Mark your daily attendance</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {status && <div className="alert alert-success">{status}</div>}

      <div className="card-grid">
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🕒</div>
          <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>Check In</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Mark your arrival for today
          </p>
          <button className="btn btn-primary" onClick={handleCheckIn} disabled={loading === 'in'}>
            {loading === 'in' ? 'Checking in...' : 'Check In Now'}
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚪</div>
          <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>Check Out</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Mark your departure for today
          </p>
          <button className="btn btn-success" onClick={handleCheckOut} disabled={loading === 'out'}>
            {loading === 'out' ? 'Checking out...' : 'Check Out Now'}
          </button>
        </div>
      </div>

      {data && (
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Today's Record</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <div className="stat-info">
                <div className="label">Check In</div>
                <div className="value" style={{ fontSize: '1rem' }}>
                  {data.checkIn ? new Date(data.checkIn).toLocaleTimeString() : '—'}
                </div>
              </div>
            </div>
            <div>
              <div className="stat-info">
                <div className="label">Check Out</div>
                <div className="value" style={{ fontSize: '1rem' }}>
                  {data.checkOut ? new Date(data.checkOut).toLocaleTimeString() : '—'}
                </div>
              </div>
            </div>
            <div>
              <div className="stat-info">
                <div className="label">Working Hours</div>
                <div className="value" style={{ fontSize: '1rem' }}>
                  {data.workingHours || '—'} hrs
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceTracker;
