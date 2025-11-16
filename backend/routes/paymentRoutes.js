import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';
import { createPayment, verifyPayment } from '../controller/paymentController.js';

const router = express.Router();

router.post('/create',authMiddleware,verifyAccessToken,createPayment);

router.post('/verify',authMiddleware,verifyAccessToken,verifyPayment);

export default router