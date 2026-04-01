const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const User = require("../models/User");
const Employee = require("../models/Employee");

const checkIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ User: req.user });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "employee profile not found" });

    const today = new Date().setHours(0, 0, 0, 0);
    const exitingRecord = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });
    if (exitingRecord)
      return res
        .status(400)
        .json({ success: false, message: "already checked In for today" });
    const newRecord = new Attendance({
      employeeId: employee._id,
      date: today,
      checkIn: new Date(),
    });
    await newRecord.save();
    res.status(200).json({ success: true, data: newRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkOut = async (req, res) => {
  // const userId=req.params.id;

  try {
    const employee = await Employee.findOne({ User: req.user });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "employee profile not found" });

    const today = new Date().setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });
    if (!attendance)
      return res.status(404).json({
        success: false,
        message: "no check-In record found for today",
      });
    if (attendance.checkOut)
      return res.status(400).json({
        success: false,
        message: "check-out already marked for today",
      });
    attendance.checkOut = new Date();
    const hours = (
      (attendance.checkOut - attendance.checkIn) /
      (1000 * 60 * 60)
    ).toFixed(2);
    attendance.workingHours = hours;
    await attendance.save();
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeAttendance = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const records = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getEmployeeAttendance,
};
