import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const stockTransactionSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    type: {
        type: String,
        enum: ['import', 'export', 'adjustment', 'transfer'],
        required: true
    },
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    batchNumber: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number },
    totalValue: { type: Number },
    reason: { type: String, required: true },
    supplierId: { type: String },
    supplierName: { type: String },
    expiryDate: { type: String },
    location: { type: String },
    performedBy: { type: String, required: true },
    performedAt: { type: String, required: true },
    notes: { type: String },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
        required: true
    },
    invoiceNumber: { type: String },
    referenceId: { type: String }
    }, {
    timestamps: true
})

const StockTransaction = mongoose.model("StockTransaction", stockTransactionSchema);
export default StockTransaction;