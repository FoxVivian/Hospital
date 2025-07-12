import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export const labResultSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  parameter: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, default: null },
  referenceRange: { type: String, required: true },
  status: {
    type: String,
    enum: ['normal', 'abnormal', 'critical', 'high', 'low'],
    required: true
  },
  flag: { type: String, default: null },
  method: { type: String, default: null },
  instrument: { type: String, default: null },
  notes: { type: String, default: null }
}, {
  timestamps: true
});
export const LabResult = mongoose.model('LabResult', labResultSchema);
// export default LabResult;