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
  let mailDetail = {};
  const imap = connectImap(email, password);
  imap.connect();
  console.log("gelen type", type);
  return new Promise((resolve, reject) => {
    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        imap.search(type, (err, results) => {
          console.log("err", err);
          if (process === "detail") markedSeen(imap, results);
          let fetch;
          try {
            if (count === "*") {
              console.log("abc result içi", results);
              fetch = imap.fetch(results, {
                bodies: "",
              });
              console.log("fetch", fetch);
            } else {
              fetch = imap.seq.fetch(count, {
                bodies: "",
              });
            }
          } catch (error) {
            reject(error);
            return;
          }
          const mailInfoObject = {
            from: null,
            subject: null,
            id: null,
          };
          fetch.on("message", function (msg, seqno) {
            msg.on("body", function (stream, info) {
              simpleParser(stream, (err, mail) => {
                const { html, to, from, attachments, date } = mail;
                //console.log("return for detail", mail.html);
                //console.log("return for detail subject", mail.subject);
                //console.log("return for detail from", mail.from);
                console.log("return for detail date ", mail.date);
                //console.log("return for detail attachmetnt", mail.attachments);
                if (process === "detail") {
                  mailDetail.date = date;
                  mailDetail.from = from;
                  mailDetail.html = html;
                  const mailAttachments = attachments.map((attachment) => {
                    return {
                      contentType: attachment.contentType,
                      fileName: attachment.filename,
                      attachmentId: attachment.cid,
                    };
                  });
                  mailDetail.attachments = mailAttachments;
                  return;
                }
                mailInfoObject.from = from.value[0];
                mailInfoObject.subject = mail.subject;
              });
            });
            msg.once("attributes", (attrs) => {
              mailInfoObject.id = attrs.uid;
            });
            msg.on("end", () => {
              if (mailInfoObject.id === null) resolve([]);
              mailListArray.push(mailInfoObject);
            });
            msg.once("error", (err) => {
              console.log("msg err", err);
            });
          });
          fetch.once("error", function (err) {
            console.log("fetch error", err);
            reject(err);
          });
          fetch.once("end", () => {
            imap.end();
          });
        });
      });
    });
    imap.once("error", function (err) {
      console.log("abc errrr", err);
      reject(err);
    });

    imap.once("end", function () {
      if (process === "detail") resolve(mailDetail);
      resolve(mailListArray);
    });
  });
};

module.exports = { connectImap, getMailWithImap };
