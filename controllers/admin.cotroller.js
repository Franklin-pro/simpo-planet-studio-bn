import Admin from "../models/admin.model.js";

const allowedAdmin = {
    email: "simpoplanet@gmail.com",
    password: "Simpo@123",
    username: "Simpo Admin",
    role: "superadmin"
};

const createAdmin = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        const admin = new Admin({
            username,
            password,
            email,
            role
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: admin
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Allow hardcoded admin login without checking DB
        if (email === allowedAdmin.email && password === allowedAdmin.password) {
            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                data: {
                    email: allowedAdmin.email,
                    username: allowedAdmin.username,
                    role: allowedAdmin.role
                },
                source: "hardcoded"
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            data: admin,
            source: "database"
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in admin", error: error.message });
    }
};

export { createAdmin, loginAdmin };
