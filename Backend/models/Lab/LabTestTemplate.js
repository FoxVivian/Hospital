import LabParameter from "./LabParameter.js";
import mongoose from "mongoose";

const labTestTemplateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    sampleType: { type: String, required: true },
    parameters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabParameter', required: true }],
    price: { type: Number, required: true },
    insurancePrice: { type: Number, default: null },
    turnaroundTime: { type: Number, required: true }, // in hours
    preparationInstructions: { type: String, default: null },
    description: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    }, {
    timestamps: true
})
const LabTestTemplate = mongoose.model('LabTestTemplate', labTestTemplateSchema);
export default LabTestTemplate;