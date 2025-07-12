import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const medicineSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    minStockLevel: { type: Number, required: true },
    maxStockLevel: { type: Number, required: true },
    expiryDate: { type: String, required: true },
    supplier: { type: String, required: true },
    supplierId: { type: String, required: true },
    batchNumber: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    activeIngredient: { type: String },
    concentration: { type: String },
    manufacturer: { type: String },
    registrationNumber: { type: String },
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued'],
        default: 'active',
        required: true
    }
    }, {
})

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;