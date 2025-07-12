import { labResultSchema } from "./LabResult.js";
import { labNormalRangeSchema } from "./LabNormalRange.js";
import mongoose from "mongoose";

export const labTestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  patientCode: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientAge: { type: Number, required: true },
  patientGender: { type: String, enum: ["male", "female"], required: true },
  testType: { type: String, required: true },
  testCategory: { type: String, required: true },
  testCode: { type: String, required: true },
  orderedBy: { type: String, required: true },
  orderedById: { type: String, required: true },
  department: { type: String, required: true },
  orderedDate: { type: String, required: true },
  orderedTime: { type: String, required: true },
  sampleType: { type: String, required: true },
  sampleCollectedDate: { type: String, default: null },
  sampleCollectedTime: { type: String, default: null },
  sampleCollectedBy: { type: String, default: null },
  priority: {
    type: String,
    enum: ["routine", "urgent", "stat"],
    default: "routine",
  },
  status: {
    type: String,
    enum: ["ordered", "sample-collected", "in-progress", "completed", "cancelled", "rejected"],
    default: "ordered",
  },
  resultDate: { type: String, default: null },
  resultTime: { type: String, default: null },
  resultBy: { type: String, default: null },
  verifiedDate: { type: String, default: null },
  verifiedBy: { type: String, default: null },
  results: { type: [labResultSchema], default: [] },
  normalRanges: { type: [labNormalRangeSchema], default: [] },
  interpretation: { type: String, default: null },
  technicalNotes: { type: String, default: null },
  clinicalNotes: { type: String, default: null },
  price: { type: Number, required: true },
  insurancePrice: { type: Number, default: null },
  isUrgent: { type: Boolean, default: false },
  isCritical: { type: Boolean, default: false },
  reportUrl: { type: String, default: null },
  attachments: { type: [String], default: [] },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
});

export const LabTest = mongoose.model("LabTest", labTestSchema);
// export default LabTest;
