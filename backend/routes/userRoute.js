import express from 'express'
import { register } from '../controllers/userController.js';
import { verify } from 'jsonwebtoken';
import {verify} from '../controllers/userController.js';
import {reVerify} from '../controllers/userController.js';
const router =express.Router();

router.post("/register",register);
router.post("/verify",verify);
router.post("/reverify",reVerify)

export default router;