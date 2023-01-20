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
    const response = await getMailWithImap(email, password, [
      GmailQueries.getUnread(),
    ]);
    res.send("success");
  } catch (err) {
    res.send(err);
  }
};

const mailDetail = async (req, res) => {
  try {
    const { email, password } = req.headers;
    const { id } = req.params;

    const response = await getMailWithImap(
      email,
      password,
      RegularMailQueries.getById(id),
      "detail"
    );
    res.send(response);
  } catch (error) {
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
