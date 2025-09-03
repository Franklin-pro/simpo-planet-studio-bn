import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

const createAccount = async (req, res) => {
    try {
        const { username, password, email, userType } = req.body;

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const user = new Admin({
            username,
            password,
            email,
            userType: userType || "user"
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating account", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, userType: user.userType },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "24h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await Admin.find().select('-password');
        
        const maskedUsers = users.map(user => ({
            ...user.toObject(),
            email: user.email.replace(/(.{3}).*(@.*)/, '$1******$2'),
            joinedAt: user.createdAt || 'Unknown'
        }));
        
        res.status(200).json({
            success: true,
            data: maskedUsers
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};
const logout = (req, res) => {
   try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
}

export { createAccount, login, getAllUsers,logout };
