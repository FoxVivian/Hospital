import express from "express";
import {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
} from "../controllers/insuranceProviderController.js";

const insuranceProviderRouter = express.Router();

insuranceProviderRouter.post("/", createProvider);             // Create
insuranceProviderRouter.get("/", getAllProviders);             // Get all + filter
insuranceProviderRouter.get("/:id", getProviderById);          // Get one
insuranceProviderRouter.put("/:id", updateProvider);           // Update
insuranceProviderRouter.delete("/:id", deleteProvider);        // Delete

export default insuranceProviderRouter;
