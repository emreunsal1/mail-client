const express = require("express");
const {
  getAllMailList,
  mailListUnseen,
  mailListSpecifiedDate,
  mailDetail,
  sendMail,
} = require("../services/mail");
const router = express.Router();

router.get("/", getAllMailList);
router.get("/unseen", mailListUnseen);
router.get("/:year-:month-:day", mailListSpecifiedDate);
router.get("/:id", mailDetail);
router.post("/send", sendMail);

module.exports = router;
