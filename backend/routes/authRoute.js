const express = require("express");
const router = express.Router();
const { registerValidator, validateLogin } = require("../middleware/validator");
const { login, signUp, logout, resetPassword } = require("../controller/authController");

router.post("/signUp", registerValidator, signUp)

router.post("/login", validateLogin, login)

router.post("/logout", logout)

router.put("/resetPassword", validateLogin, resetPassword)

module.exports = router;