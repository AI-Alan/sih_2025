import User from '../models/user.js';
import Counsellor from '../models/counsellor.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});

        if(!users) {
            return res.status(403).json({success: false, msg: "No user found"})
        }
        
        res.status(200).json({success: true, message: "All users fetched successfully", users});

    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", error: error.message});
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // user id from route
        const updates = req.body;  // fields to update
        console.log(updates);
        // Find user and update
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updates},
            {new:true}
        );
        console.log(updatedUser)

        if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({success: true, msg: "User deleted successfully", user: deletedUser})
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error", errror: error.message})
    }
}

export const getAllCounsellor = async (req, res) => {
    try {
        const counsellors = await Counsellor.find({});
        res.status(200).json({success: true, message: "All counsellors fetched successfully", counsellors})

    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to fetch counsellors", error: error.message })
    }
}

export const createCounsellor = async (req, res) => {
    try {
        //check validation error
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                message: "Field is required",
                errors: errors.array()
            });
        }
        // Create Counsellor
        const { firstName, lastName, contactNo, email, password, qualifications, specialization = [], availability } = req.body;
        const existingCounsellor = await Counsellor.findOne({ email });

        if(existingCounsellor) return res.status(400).json({ success: false, message: "Email already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCounsellor = new Counsellor({
            firstName,
            lastName,
            contactNo,
            email,
            password: hashedPassword,
            qualifications,
            specialization,
            availability,
            role: 'counsellor'
        });
        const savedCounsellor = await newCounsellor.save();
        const { password: _pw, ...safe } = savedCounsellor.toObject();
        res.status(200).json({ success: true, message: "Counsellor created successfully", counsellor: safe })

    } catch (error) {
        res.status(400).json({ success: false, message: "Failed to create counsellor", error: error.message })
    }
}

export const updateCounsellor = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const updated = await Counsellor.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Counsellor not found' });
        const { password: _pw, ...safe } = updated.toObject();
        res.status(200).json({ success: true, message: 'Counsellor updated successfully', counsellor: safe });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update counsellor', error: error.message });
    }
}

export const deleteCounsellor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Counsellor.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Counsellor not found' });
        res.status(200).json({ success: true, message: 'Counsellor deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error in deleting counsellor', error: error.message });
    }
}

export const adminDashboard = (req, res) => {
    res.send("admin dashboard");
}