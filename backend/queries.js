const GmailQueries = {
  getByDate(date) {
    return [["X-GM-RAW", `before:${date}`]];
  },
  getUnread() {
    return [["X-GM-RAW", "has:unread"]];
  },
};

const RegularMailQueries = {
  getById(id) {
    return [["uid", id]];
  },
};

module.exports = { GmailQueries, RegularMailQueries };
