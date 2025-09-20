const express = require("express");
const { peerChat, counsellorChat, aiChat } = require("../controller/userController");
const jwtAuth = require("../middleware/auth");
const router = express.Router();

router.use(jwtAuth);

router.post("/peer-to-peer", peerChat)

router.post("/counsellor", counsellorChat)

router.post("/ai", aiChat)

module.exports = router;