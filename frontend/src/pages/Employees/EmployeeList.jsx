import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEmployees, deleteEmployee } from "../../services/api";
import { UsersIcon, PlusIcon } from "../../components/ui/Icons";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { toast } from "react-toastify";

const EmployeeList = () => {
  const { user } = useAuth();
  const role = user?.role;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmEmployee, setConfirmEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      if (res.success) setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async () => {
    if (!confirmEmployee?._id) return;
    setDeleteLoading(true);
    try {
      const res = await deleteEmployee(confirmEmployee._id);
      if (res.success) {
        toast.success("Employee deleted successfully");
        fetchEmployees();
        setConfirmEmployee(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete employee");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>Manage all employee profiles</p>
        </div>
        {role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/register")}
          >
            <PlusIcon size={16} /> Register User
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <LoadingSpinner label="Loading employees..." size={18} />
          </div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <UsersIcon size={34} />
            </div>
            <p>No employee profiles found. Create one to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper employee-table-wrapper">
            <table className="employee-table">
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
                    <td
                      data-label="Name"
                      style={{ fontWeight: 600, color: "var(--text-dark)" }}
                    >
                      {emp.firstName || "—"} {emp.lastName || ""}
                    </td>
                    <td data-label="Email" className="employee-email-cell">
                      {emp.User?.email || emp.userId?.email || "—"}
                    </td>
                    <td data-label="Department">
                      {emp.Department?.name || emp.departmentId?.name || "—"}
                    </td>
                    <td data-label="Designation">{emp.designation || "—"}</td>
                    <td data-label="Role">
                      <span
                        className={`badge badge-${emp.User?.role || emp.userId?.role || "employee"}`}
                      >
                        {emp.User?.role || emp.userId?.role || "employee"}
                      </span>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`badge ${emp.User?.isActive || emp.userId?.isActive ? "badge-active" : "badge-inactive"}`}
                      >
                        {emp.User?.isActive || emp.userId?.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td
                      data-label="Actions"
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/employees/${emp._id}`)}
                      >
                        View
                      </button>
                      {role === "admin" && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: "var(--accent-red)" }}
                          onClick={() =>
                            setConfirmEmployee({
                              _id: emp._id,
                              name: `${emp.firstName} ${emp.lastName}`.trim(),
                            })
                          }
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

      <ConfirmDialog
        open={Boolean(confirmEmployee)}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete the profile for ${confirmEmployee?.name || "this employee"}? This will also delete their login account and all related records.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setConfirmEmployee(null)}
      />
    </>
  );
};

export default EmployeeList;
