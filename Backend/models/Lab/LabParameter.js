import {labNormalRangeSchema} from "./LabNormalRange.js";
import mongoose from "mongoose";

const labParameterSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    method: { type: String, default: null },
    normalRanges: [labNormalRangeSchema],
    criticalValues: {
        low: { type: Number, default: null },
        high: { type: Number, default: null }
    },
    isRequired: { type: Boolean, default: true },
    order: { type: Number, required: true }
    }, {
    timestamps: true
})
const LabParameter = mongoose.model('LabParameter', labParameterSchema);
export default LabParameter;