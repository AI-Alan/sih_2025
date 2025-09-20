import express from 'express';
const router = express.Router();
import { registerValidator, validateLogin } from '../middleware/validator.js';
import { login, signUp, logout, resetPassword } from '../controller/authController.js';

router.post("/signUp", registerValidator, signUp)

router.post("/login", validateLogin, login)

router.post("/logout", logout)

router.put("/resetPassword", validateLogin, resetPassword)

export default router;