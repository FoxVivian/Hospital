import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const insuranceProviderSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    contractNumber: { type: String, required: true },
    coveragePercent: { type: Number, required: true },
    maxCoverageAmount: { type: Number, default: null }, // Optional field
    excludedServices: { type: [String], default: [] }, // Array of strings
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        required: true
    },
    contractStartDate: { type: String, required: true },
    contractEndDate: { type: String, required: true },
    createdAt: { type: String, required: true }
    }, {
    timestamps: true
})
const InsuranceProviderModel = mongoose.model("InsuranceProvider", insuranceProviderSchema);
export default InsuranceProviderModel;