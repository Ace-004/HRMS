const Department = require("../models/Department");
const Employee = require("../models/Employee");

const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  try {
    const department = await Department.findOne({ name });
    if (department)
      return res
        .status(400)
        .json({ success: false, message: "department already exists" });
    const newDepartment = new Department({
      name,
      description,
    });
    await newDepartment.save();
    res.status(201).json({ success: true, data: newDepartment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    if (departments.length === 0)
      return res
        .status(204)
        .json({ success: false, message: "no departments" });
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  const _id = req.params.id;
  try {
    const department = await Department.findById(_id);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "department not found" });
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  const _id = req.params.id;
  try {
    const employeesInDept = await Employee.findOne({ Department: _id });
    if (employeesInDept) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete department because employees are currently assigned to it.",
      });
    }
    const department = await Department.findByIdAndDelete(_id);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    res
      .status(200)
      .json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  deleteDepartment,
};
