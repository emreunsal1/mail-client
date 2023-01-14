const connectImap = require("../utils");

const getMail =  (req,res)=>{
  const { email, password} = req.headers;
   getMailWithImap(email,password);
  res.send("succes");
}



const getMailWithImap = (email, password)=>{
  const imap = connectImap(email,password);
  imap.once("ready", (err, box)=>{
    openInbox((err,box)=>{
      if (err) throw err;
      var f = imap.seq.fetch('1:3', {
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        struct: true
      });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
            console.log("buffer", buffer);
          });
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
}

module.exports = { getMail };