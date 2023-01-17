const { getMailWithImap } = require("../utils");

const getAllMailList = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const response = await getMailWithImap(email, password, "*");
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
    const response = await getMailWithImap(email, password, [
      ["X-GM-RAW", "has:unread"],
    ]);
    console.log("response", response);
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const mailListSpecifiedDate = async (req, res) => {
  try {
    console.log("abc spec geldi nice");
    const { email, password } = req.headers;
    const { year, month, day } = req.params;
    const selectedDate = (new Date("2023,01,17").getTime() / 1000) | 0;
    const selectedDateTwo = (new Date("2023,02,01").getTime() / 1000) | 0;

    console.log("abc paramsd", year, month, day);
    const response = await getMailWithImap(email, password, "*", [
      ["X-GM-RAW", `before:${selectedDate}`],
    ]);
    console.log("abc response", response);
    res.send("success");
  } catch (error) {
    res.send("not success");
  }
};

const mailDetail = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const { id } = req.params;
    const messageId = "1755113466042678130";
    console.log("abc gelen id", id);
    const response = await getMailWithImap(email, password, "*", [
      ["X-GM-MSGID", messageId],
    ]);
    console.log("repsponse", response);
    res.send("success");
  } catch (error) {
    res.send("not success");
  }
};

const sendMail = (req, res) => {};

module.exports = {
  getAllMailList,
  mailListUnseen,
  mailListSpecifiedDate,
  mailDetail,
  sendMail,
};
