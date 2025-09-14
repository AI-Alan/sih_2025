const express = require("express");
const router = express.Router();

router.get("/admin/user", (req, res) => {
    res.send("get all users");
})

router.post("/admin/user", (req, res) => {
    res.send("create new user");
})

router.put("/admin/user/:id", (req, res) => {
    res.send("update user details");
})

router.delete("/admin/user/:id", (req, res) => {
    res.send("delete user");
})

router.get("/admin/counsellor", (req, res) => {
    res.send("get all counsellors");
})

router.post("/admin/counsellor", (req, res) => {
    res.send("create new counsellor");
})

router.put("/admin/counsellor/:id", (req, res) => {
    res.send("update counsellor details");
})

router.delete("/admin/counsellor/:id", (req, res) => {
    res.send("delete counsellor");
})

module.exports = router;