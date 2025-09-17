if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const routes = require("./routes/index.js");
const dbConnection = require("./utils/db.js");

//db connection
dbConnection()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routes);

app.listen(8080, () => {
    console.log("server is running on port 8080");
})