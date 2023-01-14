const express = require('express')
const app = express();
const routes = require("./routes");
const dotenv = require("dotenv");
dotenv.config();



const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);

app.listen(PORT,(err)=>{
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
})
