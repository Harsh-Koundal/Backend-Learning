import express from 'express';
import { createUser, deleteUser, getUserById, getUsers, patchUser } from '../controller/controller.js';

const router = express.Router();

// User Routes

//get all users
router.get("/users",getUsers);

//create a user
router.post("/users",createUser);

//get, update, delete user by ID
router.get("/users/:id",getUserById);
router.patch("/users/:id",patchUser);
router.delete("/users/:id",deleteUser);

export default router;