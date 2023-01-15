const connectImap = require("../utils");



const login = async (req, res)=>{
  console.log('req', req.body);
  const {email, password} = req.body;
  console.log("auth", { email, password });
 try {
  const response = await imapAuth(email, password);
  res.send({ data:response, auth:"true" });
 } catch (error) {
  res.status("401").send({ errorMessage:error.message, auth:"false" });
 }

  
}

const imapAuth = (email,password)=>{
  const imap = connectImap(email,password);
  imap.connect();
  return new Promise((resolve,reject)=>{
    imap.once('error', function(err) {
     reject(err)
   });
   imap.once("ready",()=>{
    resolve(imap);
   });
   imap.once("end", ()=>{
     console.log('Connection ended');
   });
  })
}


module.exports = { login };