const { getMailWithImap } = require("../utils");
const { GmailQueries, RegularMailQueries } = require("../queries");

const getAllMailList = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const { size = 20, page = 1, date } = req.query;
    const selectedDate = (new Date(date).getTime() / 1000) | 0;

    const paginated = `${size * page - size + 1}:${size * page}`;
    const response = await getMailWithImap({
      email,
      password,
      count: paginated,
      type: date ? GmailQueries.getByDate(selectedDate) : null,
    });

    res.send(response);
  } catch (error) {
    res.send("not success");
  }
};

const mailListUnseen = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const response = await getMailWithImap({
      email: email,
      password: password,
      type: GmailQueries.getUnread(),
    });
    console.log("response", response);
    res.send(response);
  } catch (err) {
    console.log("neden catche gelmedi", err);
    res.status(404).send({
      errorMessage: err.message,
    });
  }
};

const mailDetail = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const { id } = req.params;
    console.log("abc gelen parametre", id, email, password);

    const response = await getMailWithImap({
      email: email,
      password: password,
      type: RegularMailQueries.getById(id),
      process: "detail",
    });
    console.log("abc response", response);

    res.send(response);
  } catch (error) {
    console.log(error);
    res.send("not success");
  }
};

const sendMail = (req, res) => {};

module.exports = {
  getAllMailList,
  mailListUnseen,
  mailDetail,
  sendMail,
};
