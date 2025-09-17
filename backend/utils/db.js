const mongoose = require("mongoose");

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.ATLASDB_URL);
        console.log("connected to mongoDB");
    }catch (error) {
        console.log("mongo connection error", error)
    }
}

module.exports = dbConnection;

