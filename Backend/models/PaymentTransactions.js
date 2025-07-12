import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const paymentTransactionSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    invoiceId: { type: String, required: true },
    invoiceNumber: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'transfer', 'insurance'],
        required: true
    },
    paymentReference: { type: String },
    cardNumber: { type: String },
    bankName: { type: String },
    transactionId: { type: String },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending',
        required: true
    },
    processedBy: { type: String, required: true },
    processedAt: { type: String, required: true },
    notes: { type: String },
    receiptNumber:{type:String,required:true}
    }, {
    timestamps:true
})

const PaymentTransaction = mongoose.model("PaymentTransaction", paymentTransactionSchema);
export default PaymentTransaction;