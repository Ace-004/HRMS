import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { getMyProfile, updateEmployeeProfile } from '../../services/api';

const MyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Updatable fields
  const [form, setForm] = useState({ firstName: '', lastName: '' });

  const fetchProfile = async () => {
    try {
      // Use the newly created route that queries by req.user in JWT
      const res = await getMyProfile();
      if (res.success) {
        setProfile(res.data);
        setForm({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || ''
        });
      }
    } catch (err) {
      setError('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await updateEmployeeProfile(form);
      if (res.success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        fetchProfile(); // Refresh table data
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <Layout><div className="empty-state"><p>Loading profile...</p></div></Layout>;

  return (
    <Layout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Profile</h1>
          <p>View and update your personal information</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Editable Section */}
        <div className="card">
          <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Personal Information</h3>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="modal-actions" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-success">Save Changes</button>
                <button type="button" className="btn btn-ghost" onClick={() => { setIsEditing(false); setForm({firstName: profile.firstName, lastName: profile.lastName}); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="stat-info">
                <div className="label">Full Name</div>
                <div className="value" style={{ fontSize: '1rem' }}>{profile?.firstName} {profile?.lastName}</div>
              </div>
              <div className="stat-info">
                <div className="label">Email Address</div>
                <div className="value" style={{ fontSize: '1rem' }}>{user.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Read-Only Admin Section */}
        <div className="card">
          <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Work Information</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', marginTop: '-1rem' }}>
            These details are managed by HR/Admin. Contact them for changes.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="stat-info">
              <div className="label">Role</div>
              <div className="value" style={{ fontSize: '1rem', textTransform: 'capitalize' }}>{user.role}</div>
            </div>
            <div className="stat-info">
              <div className="label">Designation</div>
              <div className="value" style={{ fontSize: '1rem' }}>{profile?.designation || '—'}</div>
            </div>
            <div className="stat-info">
              <div className="label">Status</div>
              <div className="value" style={{ fontSize: '1rem' }}>
                <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="stat-info">
              <div className="label">Joined Date</div>
              <div className="value" style={{ fontSize: '1rem' }}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfile;
