import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { createEmployeeProfile, getDepartments } from "../services/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { toast } from "react-toastify";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    designation: "",
    department: "",
  });

  useEffect(() => {
    // If profile is already completed, go to dashboard
    if (user?.profileCompleted) {
      navigate("/dashboard");
      return;
    }
    const fetchDepts = async () => {
      try {
        const res = await getDepartments();
        if (res.success) setDepartments(res.data);
      } catch (err) {
        // Admin-only route — employee might not have access to list departments
        console.log("Could not fetch departments");
      }
    };
    fetchDepts();
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createEmployeeProfile(form);
      if (res.success) {
        toast.success("Profile created successfully! Redirecting...");
        updateUser({ profileCompleted: true });
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Complete Your Profile</h1>
          <p>Please fill in your details to continue using the system</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "560px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Designation *</label>
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Software Engineer"
              required
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            {departments.length > 0 ? (
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. engineering"
                required
              />
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? (
              <LoadingSpinner label="Creating Profile..." size={16} />
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CompleteProfile;
