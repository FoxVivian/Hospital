import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

supplierRouter.post("/", createSupplier);             // Create
supplierRouter.get("/", getAllSuppliers);             // List & search
supplierRouter.get("/:id", getSupplierById);          // Get one
supplierRouter.put("/:id", updateSupplier);           // Update
supplierRouter.delete("/:id", deleteSupplier);        // Delete

export default supplierRouter;
