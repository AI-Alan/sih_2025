import express from 'express';
import { peerChat, counsellorChat, aiChat } from '../controller/userController.js';
import jwtAuth from '../middleware/auth.js';

const router = express.Router();

router.use(jwtAuth);

router.post("/peer-to-peer", peerChat)

router.post("/counsellor", counsellorChat)

router.post("/ai", aiChat)

export default router;