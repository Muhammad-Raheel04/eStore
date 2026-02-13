import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router =express.Router();

router.post("/register",register);
router.post("/verify",verify);
router.post("/reverify",reVerify);
router.post('/login',login);
router.post("/logout",isAuthenticated,logout);

export default router;