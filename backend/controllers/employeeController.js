const Employee=require('../models/Employee');
const User=require('../models/User');

const createEmployee=async(req,res)=>{
  const {userId,firstName,lastName,designation,salary,department}=req.body;
  try {
    const user=await User.findById(userId);
    if(!user)return res.status(404).json({message:"user not found"});
    const employee=await Employee.findById(userId);
    if(employee)return res.status(400).json({message:"employee already exists"});
    const newEmployee=new Employee({
      _id:userId,
      firstName,
      lastName,
      department,
      designation,
      salary
    });
    await newEmployee.save();
    res.status(201).json({success:true,data:newEmployee});
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

module.exports={
  createEmployee
}