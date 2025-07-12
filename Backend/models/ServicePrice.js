import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const servicePriceSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    price: { type: Number, required: true },
    insurancePrice: { type: Number },
    description: { type: String },
    duration: { type: Number }, // Duration in minutes
    isActive: { type: Boolean, default: true },
    effectiveDate: { type: String, required: true }, // Date in ISO format
    }, {
    timestamps: true,
})
const ServicePrice = mongoose.model("ServicePrice", servicePriceSchema);
export default ServicePrice;