import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, deleteDepartment } from '../../services/api';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleDelete = async (id, deptName) => {
    if (!window.confirm(`Are you sure you want to delete the ${deptName} department?`)) return;
    setError('');
    try {
      const res = await deleteDepartment(id);
      if (res.success) fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete department');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await createDepartment({ name, description });
      if (res.success) {
        setShowModal(false);
        setName('');
        setDescription('');
        fetchDepartments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department');
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage organizational departments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Department</button>
      </div>

      <div className="card-grid">
        {departments.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state">
              <div className="icon">🏢</div>
              <p>No departments created yet</p>
            </div>
          </div>
        ) : (
          departments.map((dept) => (
            <div className="card" key={dept._id} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: 700, color: 'var(--text-dark)', textTransform: 'capitalize', marginBottom: '0.4rem' }}>
                  {dept.name}
                </h3>
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ color: 'var(--accent-red)', padding: '0.2rem 0.5rem', marginTop: '-0.2rem' }}
                  onClick={() => handleDelete(dept._id, dept.name)}
                >
                  Delete
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {dept.description || 'No description provided'}
              </p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Department</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Department Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Engineering" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
