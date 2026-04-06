const Employee = require("../models/Employee");
const User = require("../models/User");
const Department = require("../models/Department");

const createEmployeeProfile = async (req, res) => {
  const { firstName, lastName, designation, department } = req.body;
  const requestedSalary = req.body.salary;
  try {
    const user = await User.findById(req.user);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    const employee = await Employee.findOne({ User: req.user });
    if (employee)
      return res
        .status(400)
        .json({ success: false, message: "employee already exists" });
    const departmentName = department.toLowerCase().trim();
    const departmentExists = await Department.findOne({ name: departmentName });
    if (!departmentExists)
      return res
        .status(404)
        .json({ success: false, message: "department don't exist" });
    if (
      req.role === "employee" &&
      requestedSalary !== undefined &&
      requestedSalary !== null &&
      requestedSalary !== ""
    ) {
      return res.status(403).json({
        success: false,
        message: "employees are not allowed to set salary",
      });
    }

    const newEmployeePayload = {
      User: req.user,
      firstName,
      lastName,
      Department: departmentExists,
      designation,
    };

    if (
      req.role !== "employee" &&
      requestedSalary !== undefined &&
      requestedSalary !== null &&
      requestedSalary !== ""
    ) {
      const parsedSalary = Number(requestedSalary);
      if (!Number.isFinite(parsedSalary) || parsedSalary < 0) {
        return res
          .status(400)
          .json({ success: false, message: "salary must be a valid number" });
      }
      newEmployeePayload.salary = parsedSalary;
    }

    const newEmployee = new Employee(newEmployeePayload);
    await newEmployee.save();
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { profileCompleted: true },
      { new: true, runValidators: true },
    );

    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("User", "email role isActive")
      .populate("Department", "name");
    if (employees.length === 0)
      return res.json({ success: false, message: "no employees" });
    res.json({ success: true, data: employees });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  // if ((req.role !== "admin" || req.role!=='hr') && req.user !== _id)
  // if (req.user !== _id)
  //   return res
  //     .status(403)
  //     .json({
  //       success: false,
  //       message: "forbidden : you don't have permission",
  //     });
  try {
    const employee = await Employee.findById(_id);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "employee not found" });
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployeeProfile = async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const employee = await Employee.findOne({ User: req.user });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee profile not found" });

    if (firstName) employee.firstName = firstName;
    if (lastName !== undefined) employee.lastName = lastName;

    await employee.save();
    res.status(200).json({
      success: true,
      data: employee,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  const _id = req.params.id;
  try {
    const employee = await Employee.findById(_id);
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    // Hard delete associated User account
    await User.findByIdAndDelete(employee.User);

    // Delete the Employee profile
    await Employee.findByIdAndDelete(_id);

    // Cascade delete related records
    const Leave = require("../models/Leave");
    const Attendance = require("../models/Attendance");
    const Payroll = require("../models/Payroll");
    await Leave.deleteMany({ employeeId: _id });
    await Attendance.deleteMany({ employeeId: _id });
    await Payroll.deleteMany({ employeeId: _id });

    res.status(200).json({
      success: true,
      message: "Employee and associated records deleted permanently.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findOne({ User: req.user }).populate(
      "Department",
      "name",
    );
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee profile not found" });
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEmployeeProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeProfile,
  deleteEmployee,
  getMyProfile,
};
