import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, deleteEmployee } from '../../services/api';

const EmployeeList = () => {
  const { user } = useAuth();
  const role = user?.role;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      if (res.success) setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete the profile for ${name}? This will also delete their login account and all related records.`)) return;
    try {
      const res = await deleteEmployee(id);
      if (res.success) fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>Manage all employee profiles</p>
        </div>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            + Register User
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state"><p>Loading...</p></div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <p>No employee profiles found. Create one to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                      {emp.firstName || '—'} {emp.lastName || ''}
                    </td>
                    <td>{emp.User?.email || emp.userId?.email || '—'}</td>
                    <td>{emp.Department?.name || emp.departmentId?.name || '—'}</td>
                    <td>{emp.designation || '—'}</td>
                    <td>
                      <span className={`badge badge-${emp.User?.role || emp.userId?.role || 'employee'}`}>
                        {emp.User?.role || emp.userId?.role || 'employee'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${(emp.User?.isActive || emp.userId?.isActive) ? 'badge-active' : 'badge-inactive'}`}>
                        {(emp.User?.isActive || emp.userId?.isActive) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/employees/${emp._id}`)}>
                        View
                      </button>
                      {role === 'admin' && (
                        <button 
                          className="btn btn-ghost btn-sm" 
                          style={{ color: 'var(--accent-red)' }} 
                          onClick={() => handleDelete(emp._id, `${emp.firstName} ${emp.lastName}`)}
                        >
                          Delete
                        </button>
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

export default EmployeeList;
