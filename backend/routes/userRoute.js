import express from 'express'
import { register,login ,reVerify,verify} from '../controllers/userController.js';
import { verify } from 'jsonwebtoken';

const router =express.Router();

router.post("/register",register);
router.post("/verify",verify);
router.post("/reverify",reVerify);
router.post('/login',login);

export default router;