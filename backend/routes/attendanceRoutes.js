const express=require('express');
const protected=require('../middleware/authMiddleware')
const attendanceController=require('../controllers/attendanceController');
const verifyRole=require('../middleware/roleMiddleware');

const router=express.Router();

router.post('/check-in',protected,verifyRole(['admin','hr','employee']),attendanceController.checkIn);
router.post('/check-out',protected,verifyRole(['admin','hr','employee']),attendanceController.checkOut);

module.exports=router;
