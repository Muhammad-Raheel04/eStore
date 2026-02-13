import express from 'express';
import { register,login ,reVerify,verify,logout, forgotPassword, verifyOTP, changePassword} from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router =express.Router();

router.post("/register",register);
router.post("/verify",verify);
router.post("/reverify",reVerify);
router.post('/login',login);
router.post("/logout",isAuthenticated,logout);
router.post('/forgot-password',isAuthenticated,forgotPassword);
router.post('/verify-otp/:email',verifyOTP);
router.post('/change-password',changePassword)

export default router;