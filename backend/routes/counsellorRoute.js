const express = require("express");
const router = express.Router();

router.get("/counsellor/getUser", (req, res) => {
    res.send("get assigned user/student");
})

module.exports = router;