// backend/routes/authRoute.js
import express from 'express';
const router = express.Router();
import { registerValidator, validateLogin } from '../middleware/validator.js';
import {
    login,
    loginCounsellor,
    loginAdmin,
    signUp,
    logout,
    resetPassword,
} from '../controller/authController.js';

router.post("/signUp", registerValidator, signUp);

router.post("/login", validateLogin, login);

// Role-specific login endpoints
router.post("/login/counsellor", validateLogin, loginCounsellor);
router.post("/login/admin", validateLogin, loginAdmin);

router.post("/logout", logout);

router.put("/resetPassword", validateLogin, resetPassword);

export default router;