var Imap = require("imap");
const simpleParser = require("mailparser").simpleParser;

const connectImap = (email, password) => {
  var imap = new Imap({
    user: email,
    password: password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  });
  return imap;
};

const markedSeen = (imap, results) => {
  imap.setFlags(results, ["\\Seen"], function (err) {
    if (!err) {
      console.log("marked as read");
    } else {
      console.log(JSON.stringify(err, null, 2));
    }
  });
};

const getMailWithImap = ({
  email,
  password,
  type = ["ALL"],
  process = null,
  count = "*",
}) => {
  let mailListArray = [];

  const imap = connectImap(email, password);
  imap.connect();
  return new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        imap.search(type, (err, results) => {
          if (process === "detail") markedSeen(imap, results);
          let fetch;
          if (count === "*") {
            fetch = imap.fetch(results, {
              bodies: "",
            });
          } else {
            fetch = imap.seq.fetch(count, {
              bodies: "",
            });
          }
          fetch.on("message", function (msg, seqno) {
            const mailInfoObject = {
              from: null,
              subject: null,
              id: null,
            };
            msg.on("body", function (stream, info) {
              simpleParser(stream, (err, mail) => {
                const { html, to, from, attachments } = mail;
                mailInfoObject.from = from.value[0];
                mailInfoObject.subject = mail.subject;
              });
            });
            msg.once("attributes", (attrs) => {
              mailInfoObject.id = attrs.uid;
            });
            fetch.once("end", () => {
              mailListArray.push(mailInfoObject);
              imap.end();
            });
          });
        });
      });
    });
    imap.once("error", function (err) {
      reject(err);
    });

    imap.once("end", function () {
      resolve(mailListArray);
    });
  });
};

module.exports = { connectImap, getMailWithImap };
