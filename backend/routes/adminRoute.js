import express from 'express';
const router = express.Router();
import { registerValidator } from '../middleware/validator.js';
import { getAllUser, updateUser, deleteUser, getAllCounsellor, createCounsellor } from '../controller/adminController.js';
import jwtAuth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import cookieParser from 'cookie-parser';

router.use(cookieParser());
router.use(jwtAuth);
router.use(isAdmin);

router.get("/user", getAllUser)

router.post("/counsellor", registerValidator, createCounsellor)

router.put("/user/:id", updateUser)

router.delete("/user/:id", deleteUser)

router.get("/counsellor", getAllCounsellor)

// router.put("/counsellor/:id", updateCounsellor)

// router.delete("/counsellor/:id", deleteCounsellor)

export default router;