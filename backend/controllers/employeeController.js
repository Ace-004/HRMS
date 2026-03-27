const Employee=require('../models/Employee');
const User=require('../models/User');
const Department=require('../models/Department');
const { generateToken } = require('../utils/generateToken');

const createEmployeeProfile=async(req,res)=>{
  const {firstName,lastName,designation,salary,department}=req.body;
  try {
    const user=await User.findById(req.user);
    if(!user)return res.status(404).json({success:false,message:"user not found"});
    const employee=await Employee.findOne({User:req.user});
    if(employee)return res.status(400).json({success:false,message:"employee already exists"});
    department=department.toLowerCase().trim();
    const departmentExists=await Department.findOne({name:department});
    if(!departmentExists)return res.status(404).json({success:false,message:"department don't exist"});
    const newEmployee=new Employee({
      User:req.user,
      firstName,
      lastName,
      Department:departmentExists,
      designation,
      salary
    });
    await newEmployee.save();
    const updatedUser=await User.findByIdAndUpdate(req.user,{profileCompleted:true},{new:true,runValidators:true});
    // const payload={
    //   userId:updatedUser._id,
    //   role:updatedUser.role
    // }
    // const token=generateToken(payload);
    res.status(201).json({success:true,data:newEmployee});
  } catch (error) {
    res.status(500).json({success:false,message:error.message});
  }
};

const getAllEmployees=async(req,res)=>{
  try {
    const employees=await Employee.find().populate("User","email role isActive").populate('Department','name')
    if(employees.length===0)return res.json({success:false,message:"no employees"});
    res.json({success:true,data:employees});
  } catch (error) {
    res.json({success:false,message:error.message});
  }
}

const getEmployeeById=async(req,res)=>{
  const _id=req.params.id;
  if(req.role!=='admin' && req.user!==_id)return res.status(403).json({success:false,message:"forbidden : you don't have permission"})
  try {
    const employee=await Employee.findById(_id);
    if(!employee)return res.status(404).json({success:false,message:"employee not found"});
    res.json({success:true,data:employee});
  } catch (error) {
    res.status(500).json({success:false,message:error.message});
  }
}

module.exports={
  createEmployeeProfile,
  getAllEmployees,
  getEmployeeById
}