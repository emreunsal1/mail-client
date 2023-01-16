const { getMailWithImap } = require("../utils");

const getAllMailList = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const response = await getMailWithImap(email, password);
    console.log("abc response", response);
    res.send("succes");
  } catch (error) {
    console.log("abc err", error);
    res.send("not success");
  }
};
const mailListUnseen = async (req, res) => {
  try {
    console.log("abc geldi abi", req.headers);
    const { email, password } = req.headers;
    const response = await getMailWithImap(email, password, "*", [
      ["X-GM-RAW", "has:unread"],
    ]);
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const mailListSpecifiedDate = (req, res) => {};

const mailDetail = (req, res) => {};

const sendMail = (req, res) => {};

module.exports = {
  getAllMailList,
  mailListUnseen,
  mailListSpecifiedDate,
  mailDetail,
  sendMail,
};
