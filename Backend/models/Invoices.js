
import {invoiceItemSchema} from "./InvoiceItem.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const invoiceSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  invoiceNumber: { type: String, required: true, unique: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientAddress: { type: String, required: true },
  insuranceId: { type: String },
  appointmentId: { type: String },
  services: [invoiceItemSchema],
  medicines: [invoiceItemSchema],
  labTests: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  taxPercent: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type:Number, default :0},
  paymentMethod:{
    type:String,
    enum:['cash','card','transfer','insurance','mixed','partial','pending'],
    default:'cash'
  },
  status:{
    type:String,
    enum:['draft','pending','paid','partial','overdue','cancelled'],
    default:'draft'
  },
  createdBy:{type:String,required:true},
  createdAt:{type:String,required:true},
  dueDate:{type:String,required:true},
  paidDate:{type:String},
  notes:{type:String},
  insuranceCoverage:{type:Number},
  insuranceClaimNumber:{type:String}
}, {
    timestamps:true
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;