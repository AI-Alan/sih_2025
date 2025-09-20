import dotenv from "dotenv";
import express from "express";
import routes from "./routes/index.js";
import dbConnection from "./utils/db.js";
import cors from "cors";
dotenv.config();

const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}
app.use(cors(corsOptions));

//db connection
dbConnection()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routes);

app.listen(8080, () => {
    console.log("server is running on port 8080");
})