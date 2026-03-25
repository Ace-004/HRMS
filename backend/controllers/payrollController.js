const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

const createPayroll = async (req, res) => {
  const { employeeId, month, year, basicPay, hra, deductions } = req.body;
  try {
    const netSalary = (basicPay + (hra || 0)) - (deductions || 0);
    const payroll = new Payroll({
      employeeId,
      month,
      year,
      basicPay,
      hra,
      deductions,
      netSalary
    });
    await payroll.save();
    res.status(201).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeePayrollHistory = async (req, res) => {
  const targetId = req.params.id || req.user; // Reuse pattern!
  try {
    // We need to find the Employee _id first if req.user is a User _id
    let finalEmployeeId = targetId;
    if (!req.params.id) {
        const emp = await Employee.findOne({ User: req.user });
        finalEmployeeId = emp._id;
    }

    const payrolls = await Payroll.find({ employeeId: finalEmployeeId }).sort({ year: -1, month: -1 });
    res.status(200).json({ success: true, data: payrolls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPayroll,
  getEmployeePayrollHistory
};
