const express =require('express')
const employeeController=require('../controllers/employeeController');
const protected=require('../middleware/authMiddleware')
const verifyRole=require('../middleware/roleMiddleware');

const router=express.Router();

router.post('/create',protected,verifyRole(['employee','hr','admin']),employeeController.createEmployeeProfile);
router.get('/',protected,verifyRole(['admin', 'hr']),employeeController.getAllEmployees);
router.get('/profile',protected,employeeController.getMyProfile);
router.get('/:id',protected,verifyRole(['employee','hr','admin']),employeeController.getEmployeeById);
router.put('/profile',protected,employeeController.updateEmployeeProfile);
router.delete('/:id',protected,verifyRole(['admin']),employeeController.deleteEmployee);

module.exports=router;