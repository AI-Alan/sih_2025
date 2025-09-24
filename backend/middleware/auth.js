import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Counsellor from '../models/counsellor.js';
import Admin from '../models/admin.js';

const jwtAuth = async (req, res, next) => {
    try {
        //get token from header
        const bearerHeader = req.headers["authorization"];
        const bearerToken =  bearerHeader && bearerHeader.startsWith("Bearer ") ? bearerHeader.split(" ")[1] : null;
        const token = bearerToken || req.cookies.token;

        if (!token) {
        return res.status(401).json({ message: "No token Provided" });
        }
        
        //verify token
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { userId, role } = decodedUser;
        let user = null;
        if (role === 'admin') {
            user = await Admin.findById(userId);
        } else if (role === 'counsellor') {
            user = await Counsellor.findById(userId);
        } else {
            user = await User.findById(userId);
        }
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ success: false, msg: "Invalid or expired token"})
    }
}

export default jwtAuth;