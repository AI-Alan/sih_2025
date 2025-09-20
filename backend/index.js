if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const cors = require("cors"); // <-- import cors
const app = express();
const routes = require("./routes/index.js");
const dbConnection = require("./utils/db.js");

// DB connection
dbConnection()

// Enable CORS
app.use(cors({
    origin: "*", // <-- allow all origins (for development)
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
    credentials: true // allow cookies if needed
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
});
