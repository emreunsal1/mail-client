const express = require("express");
const {
  getAllMailList,
  mailListUnseen,
  mailDetail,
  sendMail,
} = require("../services/mail");
const router = express.Router();

router.get("/", getAllMailList);
router.get("/unseen", mailListUnseen);
router.get("/:id", mailDetail);
router.post("/send", sendMail);

module.exports = router;
