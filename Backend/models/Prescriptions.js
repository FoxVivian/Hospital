import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const prescriptionSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, required: true },
    quantity: { type: Number, required: true }
    }, {
    timestamps: true
})

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;