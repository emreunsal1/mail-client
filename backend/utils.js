var Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;


const connectImap = (email,password)=>{
  var imap = new Imap({
    user: email,
    password: password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    }
  });
  return imap;
}



const getMailWithImap = (email, password, count = "*")=>{
  let mailListArray = [];
  const imap = connectImap(email,password);
  return new Promise((resolve,reject)=>{
    imap.once("ready", (err, box)=>{
      openInbox((err,box)=>{
        if (err) reject(err);
        var f = imap.seq.fetch(`1:${count}`, {
          bodies: '',
          struct: true
        });
        f.on('message', function(msg, seqno) {
          msg.on('body', function(stream, info) {
            var buffer = '';
            simpleParser(stream, (err,mail)=>{
              if(err) throw new Error(err);
              const { html, to, from, attachments } = mail;
              const mailInfoObject = {
                from: from.value[0],
                text: mail.text
              };
              mailListArray.push(mailInfoObject);
              resolve(mailListArray);
            })
            stream.once('end', function() {
            });
          });
          msg.once('attributes', function(attrs) {
          });
          msg.once('end', function() {
          });
        });
        imap.once('error', function(err) {
          console.log(err);
          reject(err);
        });
        
        imap.once('end', function() {
          console.log('Connection ended');
        });
      })
    
    })
    const openInbox = (cb)=>{
      imap.openBox('INBOX', true, cb);
    }
    imap.connect();
  })
}








module.exports = { connectImap, getMailWithImap };