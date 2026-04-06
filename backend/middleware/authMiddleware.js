const jwt=require('jsonwebtoken');
const { verifyToken } = require('../utils/verifyToken');

const protected=async(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(!authHeader)return res.status(400).json({success:false,message:"no token"});
  if(authHeader.split(' ')[0]!=='Bearer')return res.status(400).json({success:false,message:"invalid token format"});
  const header=authHeader.split(' ')[1];
  try {
    const decoded=verifyToken(header);
    req.user=decoded.userId;
    req.role=decoded.role;
    console.log(req.user,req.role)
    next();
  } catch (error) {
    res.status(401).json({success:false,message:"not authorized"});
  }
};

module.exports=protected;