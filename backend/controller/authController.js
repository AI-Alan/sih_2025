import User from '../models/user.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
    try {
        //check validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Form validation error",
            errors: errors.array()
        });
        } 

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({ success: false, message: "No account found with this email. Please register to continue." });    
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
            const token = jwt.sign(
                {userId: user._id, email},
                process.env.JWT_SECRET_KEY,
                {  expiresIn: "1d" },
            );
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, //true in production
                maxAge: 259200000
            })
            const { password: _pw, ...safeUser } = user.toObject();
            return res.status(200).json({ success: true, message: "User login successfully", user: safeUser, token })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const signUp = async (req, res) => {
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
        //save User
        const { firstName, lastName, contactNo, university, program, branch, semester, email, password, role } = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({ success: false, message: "User already exists. Please login to continue."});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            contactNo,
            university,
            program,
            branch,
            semester,
            email, 
            password: hashedPassword,
            role: role || "student"
        });
        const savedUser = await newUser.save();
        console.log(savedUser);
        const { password: _pw2, ...safeSavedUser } = savedUser.toObject();
        res.status(200).json({ success: true, message: "User registered successfully", user: safeSavedUser })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const resetPassword = (req, res) => {
    // try {
    //     const { token, updatedPassword } = req.body;
    //     console.log(token, updatedPassword);

    //     res.status(200).json({success: true, msg: "Password updated successfully"})
    // } catch (error) {
    //     res.status(400).json({success: false, msg: "Password updatation failed "})
    // }
}