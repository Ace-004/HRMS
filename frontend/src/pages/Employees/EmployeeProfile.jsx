import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { createEmployeeProfile, getDepartments } from "../../services/api";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    designation: "",
    department: "",
  });

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await getDepartments();
        if (res.success) setDepartments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await createEmployeeProfile(form);
      if (res.success) {
        setSuccess("Employee profile created successfully!");
        setTimeout(() => navigate("/employees"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Create Employee Profile</h1>
          <p>Fill in the details to set up a new employee profile</p>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => navigate("/employees")}
        >
          ← Back
        </button>
      </div>

      <div className="card" style={{ maxWidth: "580px" }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
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
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Software Engineer"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
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
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "0.5rem" }}
          >
            Create Profile
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EmployeeProfile;
