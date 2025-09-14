const express = require("express");
const { getAssignedUser } = require("../controller/counsellorController");
const router = express.Router();
const jwtAuth = require("../middleware/auth");

router.use(jwtAuth);

router.get("/getUser", getAssignedUser)

module.exports = router;