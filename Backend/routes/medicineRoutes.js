import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineController.js";

const medicineRouter = express.Router();

medicineRouter.post("/", createMedicine);            // Create
medicineRouter.get("/", getAllMedicines);            // List & search
medicineRouter.get("/:id", getMedicineById);         // Get one
medicineRouter.put("/:id", updateMedicine);          // Update
medicineRouter.delete("/:id", deleteMedicine);       // Delete

export default medicineRouter;
