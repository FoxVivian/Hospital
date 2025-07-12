import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from "../controllers/paymentTransactionController.js";

const paymentTransactionRouter = express.Router();

paymentTransactionRouter.post("/", createTransaction);             // Create
paymentTransactionRouter.get("/", getAllTransactions);             // List & filter
paymentTransactionRouter.get("/:id", getTransactionById);          // Get one by id
paymentTransactionRouter.put("/:id", updateTransaction);           // Update
paymentTransactionRouter.delete("/:id", deleteTransaction);        // Delete

export default paymentTransactionRouter;
