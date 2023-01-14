const express = require("express");
const auth = require("./auth");
const mail = require("./mail");
const router = express.Router();


router.use("/auth", auth);
router.use("/mail", mail);

module.exports = router;
