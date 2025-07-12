import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} from "../controllers/invoiceController.js";

const invoiceRouter = express.Router();

invoiceRouter.post("/", createInvoice);              // Create
invoiceRouter.get("/", getAllInvoices);              // List & filter
invoiceRouter.get("/:id", getInvoiceById);           // Get one
invoiceRouter.put("/:id", updateInvoice);            // Update
invoiceRouter.delete("/:id", deleteInvoice);         // Delete

export default invoiceRouter;
