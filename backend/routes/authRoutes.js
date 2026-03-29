const express=require('express');
const authController=require('../controllers/authController');
const verifyRole=require('../middleware/roleMiddleware');

const router=express.Router();

router.post('/login',verifyRole(['employee']),authController.postLogin);
router.post('/login/admin',verifyRole(['admin']),authController.postLogin);
router.post('/login/hr',verifyRole(['hr']),authController.postLogin);
router.post('/register',verifyRole(['admin','hr']),authController.postRegister);

module.exports=router;