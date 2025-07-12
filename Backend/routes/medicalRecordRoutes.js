import express from "express";
import {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordByAppointmentId,
  updateMedicalRecord,
  deleteMedicalRecord
} from "../controllers/medicalRecordController.js";

const medicalRecordRouter = express.Router();

medicalRecordRouter.post("/", createMedicalRecord);                       // Create
medicalRecordRouter.get("/", getAllMedicalRecords);                       // List all
medicalRecordRouter.get("/:id", getMedicalRecordById);                    // Get by ID
medicalRecordRouter.get("/appointment/:appointmentId", getMedicalRecordByAppointmentId); // Get by appointmentId
medicalRecordRouter.put("/:id", updateMedicalRecord);                     // Update
medicalRecordRouter.delete("/:id", deleteMedicalRecord);                  // Delete

export default medicalRecordRouter;
