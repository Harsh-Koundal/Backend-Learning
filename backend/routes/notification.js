import express from 'express';
import { getNotifications,markAllRead,markAsRead } from '../controller/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.get("/",authMiddleware,getNotifications);
router.patch("/:id/read",authMiddleware,markAsRead);
router.patch("/mark-all-read",authMiddleware,markAllRead);

export default router;
