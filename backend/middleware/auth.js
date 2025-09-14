const jwt = require("jsonwebtoken");
const User = require("../models/user");

const jwtAuth = async (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"]
        if(typeof bearerHeader != "undefined"){
            const token = bearerHeader.split(" ")[1];
            
            const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(decodedUser)
            req.token = decodedUser;
            next()
        }else{
            res.status(401).json({message: "No token provided"})
        }
    } catch (error) {
        res.status(401).json({ success: false, msg: "Invalid or expired token"})
    }
}

module.exports = jwtAuth;