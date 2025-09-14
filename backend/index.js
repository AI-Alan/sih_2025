if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authUser = require("./routes/authRoute");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const jwtAuth = require("./middleware/auth");

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

//session store in mongodb
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600, // time in seconds
});

//store in cookie
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
        maAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(session(sessionOptions));

app.use("/api", authUser);

app.get("/protectedRoute", jwtAuth, (req, res) => {
    res.send("home page");
})

app.listen(8080, () => {
    console.log("server is running on port 8080");
})