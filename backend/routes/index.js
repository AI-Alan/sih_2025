const express = require("express");
const authRoute = require("./authRoute");
const counsellorRoute = require("./counsellorRoute");
const adminRoute = require("./adminRoute");
const userRoute = require("./userRoute");

const router = express.Router();

router.use("/user/chat", userRoute);
router.use("/counsellor", counsellorRoute);
router.use("/admin", adminRoute);
router.use("/auth", authRoute);

module.exports = router;