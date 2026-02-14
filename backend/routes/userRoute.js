import express from 'express';
import { healthCheck,register,login ,reVerify,verify,logout, forgotPassword, verifyOTP, changePassword,allUser, getUserById} from '../controllers/userController.js';
import { isAuthenticated,isAdmin } from '../middleware/isAuthenticated.js';

const router =express.Router();

router.get('/',healthCheck)
router.post("/register",register);
router.post("/verify",verify);
router.post("/reverify",reVerify);
router.post('/login',login);
router.post("/logout",isAuthenticated,logout);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp/:email',verifyOTP);
router.post('/change-password/:email',isAuthenticated,changePassword);
router.get('/all-user',isAdmin,allUser);
router.get('/get-user/:userId',getUserById)
export default router;