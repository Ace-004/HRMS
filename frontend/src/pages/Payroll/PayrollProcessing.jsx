import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyPayroll, createPayroll, getEmployees } from "../../services/api";
import { DollarIcon, PlusIcon } from "../../components/ui/Icons";
import { toast } from "react-toastify";

const PayrollProcessing = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const isManager = user?.role === "admin" || user?.role === "hr";

  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicPay: "",
    hra: "",
    deductions: "",
  });

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payRes = await getMyPayroll();
        if (payRes.success) setRecords(payRes.data);

        if (isManager) {
          const empRes = await getEmployees();
          if (empRes.success) setEmployees(empRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [isManager]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createPayroll({
        ...form,
        month: Number(form.month),
        year: Number(form.year),
        basicPay: Number(form.basicPay),
        hra: Number(form.hra),
        deductions: Number(form.deductions),
      });
      if (res.success) {
        toast.success("Payroll record created!");
        setShowModal(false);
        setForm({
          employeeId: "",
          month: "",
          year: "",
          basicPay: "",
          hra: "",
          deductions: "",
        });
        const payRes = await getMyPayroll();
        if (payRes.success) setRecords(payRes.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create payroll");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Payroll</h1>
          <p>
            {isManager
              ? "Manage employee payroll records"
              : "View your salary history"}
          </p>
        </div>
        {isManager && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon size={16} /> Create Payroll
          </button>
        )}
      </div>

      <div className="card">
        {records.length === 0 ? (
          <div className="empty-state">
            <div className="icon">
              <DollarIcon size={34} />
            </div>
            <p>No payroll records found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Basic Pay</th>
                  <th>HRA</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id}>
                    <td
                      data-label="Period"
                      style={{ fontWeight: 600, color: "var(--text-dark)" }}
                    >
                      {months[rec.month]} {rec.year}
                    </td>
                    <td data-label="Basic Pay">
                      ₹{rec.basicPay?.toLocaleString()}
                    </td>
                    <td data-label="HRA">₹{(rec.hra || 0).toLocaleString()}</td>
                    <td
                      data-label="Deductions"
                      style={{ color: "var(--accent-red)" }}
                    >
                      -₹{(rec.deductions || 0).toLocaleString()}
                    </td>
                    <td
                      data-label="Net Salary"
                      style={{ fontWeight: 700, color: "var(--accent-green)" }}
                    >
                      ₹{rec.netSalary?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Payroll Record</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Employee</label>
                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Month (1-12)</label>
                  <input
                    name="month"
                    type="number"
                    min="1"
                    max="12"
                    value={form.month}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="2026"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Basic Pay</label>
                  <input
                    name="basicPay"
                    type="number"
                    value={form.basicPay}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>HRA</label>
                  <input
                    name="hra"
                    type="number"
                    value={form.hra}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Deductions</label>
                  <input
                    name="deductions"
                    type="number"
                    value={form.deductions}
                    onChange={handleChange}
                  />
                </div>
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
    </>
  );
};

export default PayrollProcessing;
