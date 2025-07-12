import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export const invoiceItemSchema = new mongoose.Schema({
    id: { type: String,default: uuidv4, unique: true },
    type: {
        type: String,
        enum: ['service', 'medicine', 'lab_test'],
        required: true
    },
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    doctorId: { type: String },
    doctorName: { type: String },
    department: { type: String }
    }, {
    timestamps: true
})

export const InvoiceItem = mongoose.model("InvoiceItem", invoiceItemSchema);
// export default InvoiceItem;