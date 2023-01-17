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

const getMailWithImap = (email, password, count, type = ["ALL"]) => {
  let mailListArray = [];
  const imap = connectImap(email, password);
  imap.connect();
  return new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.openBox("INBOX", true, (err, box) => {
        console.log("abc gelen type", type);
        imap.search(type, (err, results) => {
          console.log("abc results", results);
          var f = imap.fetch(results, { bodies: "" });
          f.on("message", function (msg, seqno) {
            msg.once("attributes", function (attrs) {
              console.log("attrs", attrs);
            });
            msg.on("body", function (stream, info) {
              simpleParser(stream, (err, mail) => {
                const { html, to, from, attachments } = mail;
                const mailInfoObject = {
                  from: from.value[0],
                  text: mail.text,
                };
                mailListArray.push(mailInfoObject);
              });
            });
          });
          f.once("end", () => {
            imap.end();
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
