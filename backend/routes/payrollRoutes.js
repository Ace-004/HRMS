const express = require('express');
const payrollController = require('../controllers/payrollController');
const protected = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin can create payroll
router.post('/create', protected, verifyRole(['admin', 'hr']), payrollController.createPayroll);

// Admin can see one employee's history
router.get('/employee/:id', protected, verifyRole(['admin', 'hr']), payrollController.getEmployeePayrollHistory);

// Employee can see their own history
router.get('/my', protected, payrollController.getEmployeePayrollHistory);

module.exports = router;
