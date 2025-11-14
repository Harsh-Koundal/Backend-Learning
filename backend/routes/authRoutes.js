import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signUp, signIn, getProfile, users, updateUsers, deleteUser } from '../controller/authController.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { adminControles } from '../controller/authController.js';

const router = express.Router();


// public route 
router.post("/signup",signUp);
router.post('/signin',signIn);

// protected route
router.get('/profile',authMiddleware,getProfile);

// admin only route
router.get('/users',authMiddleware,adminMiddleware,users);
router.patch('/users/:id',authMiddleware,adminMiddleware,updateUsers)
router.delete('/users/delete/:id',authMiddleware,adminMiddleware,deleteUser)
router.get('/adminControles',authMiddleware,adminMiddleware,adminControles)

export default router;