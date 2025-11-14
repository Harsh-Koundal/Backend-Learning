import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signUp, signIn, getProfile, users, updateUsers, deleteUser, resetPassword } from '../controller/authController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { adminControles } from '../controller/authController.js';
import { sendOTPController,verifyOTPController } from '../controller/sendOTPController.js';

const router = express.Router();


// public route 
router.post("/signup",signUp);
router.post('/signin',signIn);

// protected route
router.get('/profile',authMiddleware,getProfile);
router.post('/forgot-password/send',sendOTPController);
router.post('/forgot-password/verify',verifyOTPController);
router.post('/forgot-password/reset',resetPassword);

// admin only route
router.get('/users',authMiddleware,adminMiddleware,users);
router.patch('/users/:id',authMiddleware,adminMiddleware,updateUsers)
router.delete('/users/delete/:id',authMiddleware,adminMiddleware,deleteUser)
router.get('/adminControles',authMiddleware,adminMiddleware,adminControles)

export default router;