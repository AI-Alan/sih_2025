import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    branch: {
        type: String,
        required: true
    },
    semester: String, 
},{
    timestamps: true
}
)

const Student = mongoose.model("Student", studentSchema);
export default Student;