if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");

app.use(express.urlencoded({ extended: true }));

main()
   .then(() => {
      console.log("connected to db");
   })
   .catch( (err) => {
      console.log(err);
   });

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

app.get("/api", (req, res) => {
    try {
        res.status(200).json({
            msg: "api is working"
        })
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get("/", (req, res) => {
    res.send("working");
    console.log("app is working");
})

app.listen(8080, () => {
    console.log("server is running on port 8080");
})