const express = require("express");
const { getMail } = require("../services/mail");
const router = express.Router();


router.get("/", getMail);


module.exports = router;