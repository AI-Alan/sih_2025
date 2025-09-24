import mongoose from 'mongoose';

const counsellorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    availability: {
        type: [String],
        required: true
    }
},{
    timestamps: true
}
)

const Counsellor = mongoose.model("Counsellor", counsellorSchema);
export default Counsellor;
