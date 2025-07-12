import express from "express";
import {
  createLabEquipment,
  getAllLabEquipment,
  getLabEquipmentById,
  updateLabEquipment,
  deleteLabEquipment
} from "../controllers/labEquipmentController.js";

const labEquipmentRouter = express.Router();

labEquipmentRouter.post("/", createLabEquipment);             // Create
labEquipmentRouter.get("/", getAllLabEquipment);              // List/filter
labEquipmentRouter.get("/:id", getLabEquipmentById);          // Get one
labEquipmentRouter.put("/:id", updateLabEquipment);           // Update
labEquipmentRouter.delete("/:id", deleteLabEquipment);        // Delete

export default labEquipmentRouter;
