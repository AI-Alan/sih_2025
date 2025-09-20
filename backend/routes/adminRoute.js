const express = require("express");
const router = express.Router();
const { registerValidator } = require("../middleware/validator.js");
const { getAllUser, updateUser, deleteUser, getAllCounsellor, createCounsellor, updateCounsellor, deleteCounsellor, dashboard} = require("../controller/adminController");
const jwtAuth = require("../middleware/auth.js");
const isAdmin = require("../middleware/isAdmin.js");
const cookieParser = require("cookie-parser");

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

module.exports = router;