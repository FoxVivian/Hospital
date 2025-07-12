import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  code: { type: String, required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  identityCard: { type: String, required: true },
  insuranceId: { type: String },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
  },
  medicalHistory: { type: [String], default: [] },
  status: { type: String, enum: ['active', 'inactive'], required: true },
  createdAt: { type: String, required: true },
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
