import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { signUp, signIn, getProfile, users, updateUsers, deleteUser } from '../controller/authController.js';
import { adminMiddleare } from '../middleware/adminMiddleware.js';
import { adminControles } from '../controller/authController.js';

const router = express.Router();


// public route 
router.post("/signup",signUp);
router.post('/signin',signIn);

// protected route
router.get('/profile',authMiddleware,getProfile);

// admin only route
router.get('/users',authMiddleware,adminMiddleare,users);
router.patch('/users/:id',authMiddleware,adminMiddleare,updateUsers)
router.delete('/users/delete/:id',authMiddleware,adminMiddleare,deleteUser)
router.get('/adminControles',authMiddleware,adminMiddleare,adminControles)

export default router;