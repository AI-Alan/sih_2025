const express = require("express");
const router = express.Router();
const { registerValidator, validateLogin } = require("../middleware/valiidate");
const User = require("../models/user");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

router.post("/signUp", registerValidator, async (req, res) => {
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
})

router.post("/login", validateLogin, async (req, res) => {
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

        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if(!user){
            return res.json("user not found.... please insert valid username, password");    
        }else{
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});
            const token = jwt.sign(
                {userId: user._id, username},
                process.env.JWT_SECRET_KEY,
                {  expiresIn: "1h" },
            );

            res.status(200).json({ success: true, msg: "User loggedIn successfully", token})
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: true,
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
})

module.exports = router;