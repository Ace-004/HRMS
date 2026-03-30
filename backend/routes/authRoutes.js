const express=require('express');
const authController=require('../controllers/authController');
const verifyRole=require('../middleware/roleMiddleware');

const router=express.Router();

router.post('/login',authController.postLogin);
router.post('/login/admin',authController.postLoginAdmin);
router.post('/login/hr',authController.postLoginHr);
router.post('/register',verifyRole(['admin','hr']),authController.postRegister);

module.exports=router;