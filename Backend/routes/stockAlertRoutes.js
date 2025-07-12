import express from "express";
import {
  createStockAlert,
  getAllStockAlerts,
  getStockAlertById,
  updateStockAlert,
  deleteStockAlert
} from "../controllers/stockAlertController.js";

const stockAlertRouter = express.Router();

stockAlertRouter.post("/", createStockAlert);              // Create
stockAlertRouter.get("/", getAllStockAlerts);              // List/filter
stockAlertRouter.get("/:id", getStockAlertById);           // Get one
stockAlertRouter.put("/:id", updateStockAlert);            // Update (e.g., mark as read)
stockAlertRouter.delete("/:id", deleteStockAlert);         // Delete

export default stockAlertRouter;
