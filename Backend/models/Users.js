import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'nurse', 'staff', 'pharmacist', 'lab_technician'],
        required: true
    },
    avatar: { type: String, default: '' }
    }, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);
export default User;