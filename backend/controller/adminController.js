const User = require("../models/user");
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

exports.getAllUser = (req, res) => {
    res.send("get all users");
}

exports.updateUser = (req, res) => {
    res.send("update user details");
}

exports.deleteUser = (req, res) => {
    res.send("delete user");
}

exports.getAllCounsellor = async (req, res) => {
    try {
        const counsellors = await User.find({});
        console.log(counsellors);
        res.status(200).json({success: true, counsellors})

    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

exports.createCounsellor = async (req, res) => {
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

exports.updateCounsellor = (req, res) => {
    res.send("update user counsellor");
}

exports.deleteCounsellor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCounsellor = await User.findByIdAndDelete(id);

        res.status(200).json({success: true, msg: "Counsellor deleted successfully" ,deletedCounsellor})
    } catch (error) {
        res.status(400).json({ success: false, msg: "Error in deleting counsellor" ,error: error.message })
    }
}

exports.adminDashboard = (req, res) => {
    res.send("admin dashboard");
}