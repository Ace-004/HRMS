const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

const applyForLeave = async (req, res) => {
  const { leaveType, startDate, endDate } = req.body;
  try {
    // req.user is the User._id, we need the Employee._id for the Leave ref
    const employee = await Employee.findOne({ User: req.user });
    if (!employee) return res.status(404).json({ success: false, message: "Employee profile not found" });

    const leave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate
    });
    await leave.save();
    res.status(201).json({ success: true, data: leave }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('employeeId', 'firstName lastName designation');
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeLeaves = async (req, res) => {
  try {
    let targetEmployeeId = req.params.id;

    // If no ID is passed in params, they are requesting their own leaves (my-leaves route)
    if (!targetEmployeeId) {
      const employee = await Employee.findOne({ User: req.user });
      if (!employee) return res.status(404).json({ success: false, message: "Employee profile not found" });
      targetEmployeeId = employee._id;
    }

    const leaves = await Leave.find({ employeeId: targetEmployeeId });
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  const leaveId = req.params.id; // Corrected from employeeId=req.params.id
  const { status } = req.body;
  try {
    const updateLeave = await Leave.findByIdAndUpdate(leaveId, { status }, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: updateLeave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForLeave,
  getAllLeaves,
  getEmployeeLeaves,
  updateLeaveStatus
};