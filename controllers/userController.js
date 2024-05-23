// backend/controllers/userController.js
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
    const { name, email, password, userType = 'user' } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, userType });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isMember: user.isMember,
            userType: user.userType,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isMember: user.isMember,
            userType: user.userType,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

export const becomeMember = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.isMember = true;
        await user.save();
        res.json({ message: 'Membership updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const cancelMembership = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.isMember = false;
        await user.save();
        res.json({ message: 'Membership cancelled successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isMember: user.isMember,
            userType: user.userType,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
