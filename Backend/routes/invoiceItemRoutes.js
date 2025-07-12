import express from "express";
import {
  createInvoiceItem,
  getAllInvoiceItems,
  getInvoiceItemById,
  updateInvoiceItem,
  deleteInvoiceItem,
} from "../controllers/invoiceItemController.js";

const invoiceItemRouter = express.Router();

invoiceItemRouter.post("/", createInvoiceItem);           // Create item
invoiceItemRouter.get("/", getAllInvoiceItems);           // Get all
invoiceItemRouter.get("/:id", getInvoiceItemById);        // Get one by id
invoiceItemRouter.put("/:id", updateInvoiceItem);         // Update by id
invoiceItemRouter.delete("/:id", deleteInvoiceItem);      // Delete by id

export default invoiceItemRouter;
