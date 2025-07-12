import mongoose from "mongoose";

export const labNormalRangeSchema = new mongoose.Schema({
    parameter: { type: String, required: true },
    minValue: { type: Number, default: null },
    maxValue: { type: Number, default: null },
    unit: { type: String, required: true },
    ageGroup: { type: String, default: null },
    condition: { type: String, default: null },
})
export const LabNormalRange = mongoose.model('LabNormalRange', labNormalRangeSchema);
// export default LabNormalRange;