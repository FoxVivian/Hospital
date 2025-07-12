import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const patientRouter = express.Router();

patientRouter.post("/", createPatient);            // Create
patientRouter.get("/", getAllPatients);            // List & search
patientRouter.get("/:id", getPatientById);         // Get one
patientRouter.put("/:id", updatePatient);          // Update
patientRouter.delete("/:id", deletePatient);       // Delete

export default patientRouter;
