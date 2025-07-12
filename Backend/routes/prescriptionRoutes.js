import express from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post("/", createPrescription);              // Create
prescriptionRouter.get("/", getAllPrescriptions);              // List all
prescriptionRouter.get("/:id", getPrescriptionById);           // Get by ID
prescriptionRouter.put("/:id", updatePrescription);            // Update
prescriptionRouter.delete("/:id", deletePrescription);         // Delete

export default prescriptionRouter;
