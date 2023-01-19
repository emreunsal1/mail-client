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

const getMailAttr = (msg) => {
  msg.once("attributes", (attr) => {
    console.log("abc attr", attr);
    return attr;
  });
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
            msg.on("body", function (stream, info) {
              simpleParser(stream, (err, mail) => {
                const { html, to, from, attachments } = mail;
                //usera dönülecekler
                //console.log("abc 1 ", from.value);
                //console.log("abc 2", mail.subject);
                console.log("abc 3", mail.messageId);
                const mailInfoObject = {
                  from: from.value[0],
                  subject: mail.subject,
                  id: null,
                };
                mailListArray.push(mailInfoObject);
                const atttrrsss = msg.once("attributes", (attrs) => {
                  return attrs;
                });
                console.log("denme", atttrrsss);
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
