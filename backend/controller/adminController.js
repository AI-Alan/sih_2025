import User from '../models/user.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});

        if(!users) {
            return res.status(403).json({success: false, msg: "No user found"})
        }
        
        res.status(200).json({success: true, msg: "All users fetched successfully", users});

    } catch (error) {
        res.status(500).json({success: false, msg: "Internal server error", error: error.message});
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

        res.status(200).json({ message: "User updated successfully", user: updatedUser });

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
        res.status(500).json({success: false, msg: "Internal server error", errror: error.message})
    }
}

export const getAllCounsellor = async (req, res) => {
    try {
        const counsellors = await User.find({});
        console.log(counsellors);
        res.status(200).json({success: true, counsellors})

    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

export const createCounsellor = async (req, res) => {
    try {
        //check validation error
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                msg: "Field is required",
                errors: errors.array()
            });
        }
        //save User
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({ $or: [{username}, {email}]});

        if(existingUser) return res.status(400).json({ message: "Username or email already exist"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email, 
            password: hashedPassword,
            role
        });
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(200).json({ success: true, msg: "User registered successfully", savedUser })

    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

// export const updateCounsellor = (req, res) => {
//     res.send("update user counsellor");
// }

// exports const deleteCounsellor = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedCounsellor = await User.findByIdAndDelete(id);

//         res.status(200).json({success: true, msg: "Counsellor deleted successfully" ,deletedCounsellor})
//     } catch (error) {
//         res.status(400).json({ success: false, msg: "Error in deleting counsellor" ,error: error.message })
//     }
// }

export const adminDashboard = (req, res) => {
    res.send("admin dashboard");
}