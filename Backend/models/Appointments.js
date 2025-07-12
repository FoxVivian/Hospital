import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: {
      type: String,
      enum: ["checkup", "followup", "emergency", "consultation"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"],
      required: true,
    },
    notes: { type: String },
  },
  {}
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
