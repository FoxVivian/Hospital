import mongoose from "mongoose";

const labQualityControlSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    testType: { type: String, required: true },
    controlLevel: {
        type: String,
        enum: ['low', 'normal', 'high'],
        required: true
    },
    targetValue: { type: Number, required: true },
    measuredValue: { type: Number, required: true },
    unit: { type: String, required: true },
    deviation: { type: Number, required: true },
    isWithinRange: { type: Boolean, required: true },
    performedBy: { type: String, required: true },
    performedAt: { type: String, required: true },
    equipmentId: { type: String, default: null },
    batchNumber: { type: String, default: null },
    notes: { type: String, default: null }
    }, {
    timestamps: true
})
const LabQualityControl = mongoose.model('LabQualityControl', labQualityControlSchema);
export default LabQualityControl;