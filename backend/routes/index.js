import express from 'express';
import authRoute from './authRoute.js';
import counsellorRoute from './counsellorRoute.js';
import adminRoute from './adminRoute.js'
import userRoute from './userRoute.js';
import chatbotRoute from './chatbotRoute.js';
import stickyNoteRoute from './stickyNoteRoute.js';
const router = express.Router();

router.use("/user/chat", userRoute);
router.use("/counsellor", counsellorRoute);
router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.use("/chatbot", chatbotRoute);
router.use("/sticky-notes", stickyNoteRoute);

export default router;