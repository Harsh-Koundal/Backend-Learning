import express from 'express';
import upload from '../config/multerCloud.js'
import { productUpload,getProduct,upadteProduct,deleteProduct } from '../controller/productController.js';
import authMiddleware from '../middleware/authMiddleware.js'
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/',authMiddleware,getProduct);

router.post('/upload',authMiddleware,adminMiddleware,upload.single("image"),productUpload);

router.patch('/:id',authMiddleware,adminMiddleware,upload.single("image"),upadteProduct);

router.delete('/:id',authMiddleware,adminMiddleware,deleteProduct);

export default router;