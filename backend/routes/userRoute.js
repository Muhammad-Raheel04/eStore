import express from 'express';
import { healthCheck,register,login ,reVerify,verify,logout, forgotPassword, verifyOTP, changePassword,allUser, getUserById,updateUser} from '../controllers/userController.js';
import { isAuthenticated,isAdmin } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router =express.Router();


router.post("/register",register);
router.post("/reverify",reVerify);
router.post('/login',login);
router.post("/logout",isAuthenticated,logout);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp/:email',verifyOTP);
router.post('/change-password/:email',isAuthenticated,changePassword);
router.post("/verify",verify);
router.get('/all-user',isAdmin,allUser);
router.get('/',healthCheck)
router.get('/get-user/:userId',getUserById)
router.put('/update/:id',isAuthenticated,singleUpload,updateUser);
export default router;