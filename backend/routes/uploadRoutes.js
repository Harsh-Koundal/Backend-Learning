import express from "express";
import authMiddleware from '../middleware/authMiddleware.js'
import upload from "../config/multerCloud.js";
import {
    uploadFile,
    getFiles,
    deleteFile
} from '../controller/uploadController.js';

const router = express.Router();

router.post('/',authMiddleware,upload.single("file"),uploadFile);

router.get('/',authMiddleware,getFiles);

router.delete('/:id',authMiddleware,deleteFile);

export default router;