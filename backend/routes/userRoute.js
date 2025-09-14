const express = require("express");
const router = express.Router();

router.post("/user/chat/peer-to-peer", (req, res) => {
    res.send("peer to peer chat");
})

router.post("/user/chat/counsellor", (req, res) => {
    res.send("chat with counsellor")
})

router.post("/user/chat/ai", (req, res) => {
    res.send("chat with AI")
})

module.exports = router;