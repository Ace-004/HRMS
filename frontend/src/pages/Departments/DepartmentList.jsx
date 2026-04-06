import React, { useState, useEffect } from "react";
import {
  getDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/api";
import { PlusIcon, BuildingIcon } from "../../components/ui/Icons";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { toast } from "react-toastify";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [confirmDepartment, setConfirmDepartment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getDepartments();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async () => {
    if (!confirmDepartment?._id) return;
    setDeleteLoading(true);
    try {
      const res = await deleteDepartment(confirmDepartment._id);
      if (res.success) {
        toast.success("Department deleted");
        fetchDepartments();
        setConfirmDepartment(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete department");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createDepartment({ name, description });
      if (res.success) {
        toast.success("Department created successfully");
        setShowModal(false);
        setName("");
        setDescription("");
        fetchDepartments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create department");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage organizational departments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusIcon size={16} /> New Department
        </button>
      </div>

      <div className="card-grid">
        {loading ? (
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <div className="empty-state">
              <LoadingSpinner label="Loading departments..." size={18} />
            </div>
          </div>
        ) : departments.length === 0 ? (
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <div className="empty-state">
              <div className="icon">
                <BuildingIcon size={34} />
              </div>
              <p>No departments created yet</p>
            </div>
          </div>
        ) : (
          departments.map((dept) => (
            <div
              className="card"
              key={dept._id}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    color: "var(--text-dark)",
                    textTransform: "capitalize",
                    marginBottom: "0.4rem",
                  }}
                >
                  {dept.name}
                </h3>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{
                    color: "var(--accent-red)",
                    padding: "0.2rem 0.5rem",
                    marginTop: "-0.2rem",
                  }}
                  onClick={() =>
                    setConfirmDepartment({ _id: dept._id, name: dept.name })
                  }
                >
                  Delete
                </button>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {dept.description || "No description provided"}
              </p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Department</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engineering"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                />
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmDepartment)}
        title="Delete Department"
        message={`Are you sure you want to delete the ${confirmDepartment?.name || "selected"} department?`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDepartment(null)}
      />
    </>
  );
};

export default DepartmentList;
