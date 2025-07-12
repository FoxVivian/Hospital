import express from "express";
import {
  createStockTransaction,
  getAllStockTransactions,
  getStockTransactionById,
  updateStockTransaction,
  deleteStockTransaction
} from "../controllers/stockTransactionController.js";

const stockTransactionRouter = express.Router();

stockTransactionRouter.post("/", createStockTransaction);             // Create
stockTransactionRouter.get("/", getAllStockTransactions);             // List/filter
stockTransactionRouter.get("/:id", getStockTransactionById);          // Get one
stockTransactionRouter.put("/:id", updateStockTransaction);           // Update
stockTransactionRouter.delete("/:id", deleteStockTransaction);        // Delete

export default stockTransactionRouter;
