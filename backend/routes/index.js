import express from 'express';
import authRoute from './authRoute.js';
import counsellorRoute from './counsellorRoute.js';
import adminRoute from './adminRoute.js'
import userRoute from './userRoute.js';
const router = express.Router();

router.use("/user/chat", userRoute);
router.use("/counsellor", counsellorRoute);
router.use("/admin", adminRoute);
router.use("/auth", authRoute);

export default router;