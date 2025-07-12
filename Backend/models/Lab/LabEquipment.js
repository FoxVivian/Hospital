import mongoose from "mongoose";
const labEquipmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'out_of_order', 'retired'],
    default: 'active',
    required: true
  },
  lastMaintenanceDate: { type: String, default: null },
  nextMaintenanceDate: { type: String, default: null },
  calibrationDate: { type: String, default: null },
  nextCalibrationDate: { type: String, default: null },
  supportedTests: [{ type: String }],
  notes: { type: String, default: null }
}, {
  timestamps: true
});
const LabEquipment = mongoose.model('LabEquipment', labEquipmentSchema);
export default LabEquipment;