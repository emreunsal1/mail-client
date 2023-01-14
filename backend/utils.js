var Imap = require('imap');

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



module.exports = connectImap;