import User from '../models/user.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Student from '../models/student.js';
import Counsellor from '../models/counsellor.js';

// --------------- user login --------------------
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

// ----------------- Register -> user(admin), counsellor, student -----------------
export const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Field is required",
        errors: errors.array()
      });
    }

    // Destructure request body
    const { firstName, lastName, email, password, contactNo, role, ...rest } = req.body;
   
    const existingUser = await User.findOne({email});

    if(existingUser) return res.status(400).json({ message: "User already exist please login to continue"});

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      contactNo,
      password: hashedPassword,
      role
    });
    await user.save();

    // 6. Create role-specific document
    let profile = null;

    if (role === "student") {
      profile = new Student({
        userId: user._id,
        university: rest.university,
        program: rest.program,
        branch: rest.branch,
        semester: rest.semester
      });
      await profile.save();
    }

    if (role === "counsellor") {
      profile = new Counsellor({
        userId: user._id,
        specialization: rest.specialization,
        experience: rest.experience,
        availability: rest.availability
      });
      await profile.save();
    }

    res.status(201).json({success: true, msg: `${role} registered successfully`, user, profile });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Internal server error", error: error.message });
  }
};

// --------------- user logout --------------------
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