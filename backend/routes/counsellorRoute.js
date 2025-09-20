import express from 'express';
import { getAssignedUser } from '../controller/counsellorController.js';
import jwtAuth from '../middleware/auth.js';
const router = express.Router();

router.use(jwtAuth);

router.get("/getUser", getAssignedUser)

export default router;