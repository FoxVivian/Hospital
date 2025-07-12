import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const stockAlertSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    alertType: {
        type: String,
        enum: ['low_stock', 'expiry_warning', 'expired', 'out_of_stock'],
        required: true
    },
    currentStock: { type: Number, required: true },
    minStock: { type: Number },
    expiryDate: { type: String },
    daysToExpiry: { type: Number },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: String, required: true }
    }, {
    timestamps: true
})

const StockAlert = mongoose.model("StockAlert", stockAlertSchema);
export default StockAlert;