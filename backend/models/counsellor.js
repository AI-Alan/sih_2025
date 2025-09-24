import mongoose from 'mongoose';

const counsellorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    qualifications: {
        type: String,
        required: true
    },
    specialization: {
        type: [String], // e.g., ["Stress", "Career Guidance"]
        default: []
    },
    availability: {
        type: String, // e.g., "Mon-Fri, 10am-6pm"
        required: true
    },
    role: {
        type: String,
        default: "counsellor"
    }
}, {
    timestamps: true
});

const Counsellor = mongoose.model("Counsellor", counsellorSchema);
export default Counsellor;
