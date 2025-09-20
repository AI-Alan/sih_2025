const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "student"
    }
},{
    timestamps: true
}
)


module.exports = new mongoose.model("User", userSchema);