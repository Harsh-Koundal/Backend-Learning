import User from "../model/model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashed });
        const userToReturn = newUser.toObject();
        delete userToReturn.password;

        res.status(201).json(userToReturn);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted" });

    } catch (err) {
        next(err);
    }
};

export const patchUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updateUser = await User.findByIdAndUpdate(id,
            { $set: updates },
            { new: true }
        );
        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updateUser);
    } catch (err) {
        next(err);
    }
};
