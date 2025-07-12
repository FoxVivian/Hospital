import express from "express";
import {
  createServicePrice,
  getAllServicePrices,
  getServicePriceById,
  updateServicePrice,
  deleteServicePrice,
} from "../controllers/servicePriceController.js";

const servicePriceRouter = express.Router();

servicePriceRouter.post("/", createServicePrice);              // Create
servicePriceRouter.get("/", getAllServicePrices);              // List/filter
servicePriceRouter.get("/:id", getServicePriceById);           // Get one
servicePriceRouter.put("/:id", updateServicePrice);            // Update
servicePriceRouter.delete("/:id", deleteServicePrice);         // Delete

export default servicePriceRouter;
