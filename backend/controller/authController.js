const User = require("../models/user");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

module.exports.login = async (req, res) => {
    try {
        //check validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: "form validation error",
            errors: errors.array()
        });
        } 

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res.json("No account found with this email, Please register to continue");    
        }else{
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});
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
            return res.status(200).json({ success: true, msg: "User login successfully", user, token})
        }
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server error", error: error.message })
    }
}

module.exports.signUp = async (req, res) => {
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
        const { firstName, lastName, university, program, email, password, role } = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({ message: "User already exist please login to continue"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            university,
            program,
            email, 
            password: hashedPassword,
            role
        });
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.status(200).json({ success: true, msg: "User registered successfully", savedUser })

    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server errror", error: error.message })
    }
}

module.exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Internal server errror", error: error.message })
    }
}

exports.resetPassword = (req, res) => {
    // try {
    //     const { token, updatedPassword } = req.body;
    //     console.log(token, updatedPassword);

    //     res.status(200).json({success: true, msg: "Password updated successfully"})
    // } catch (error) {
    //     res.status(400).json({success: false, msg: "Password updatation failed "})
    // }
}