import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const supplierSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    taxCode: { type: String, required: true },
    bankAccount: { type: String },
    bankName: { type: String },
    paymentTerms: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
    createdAt: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
