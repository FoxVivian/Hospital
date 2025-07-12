import express from "express";
import {
  createLabResult,
  getAllLabResults,
  getLabResultById,
  updateLabResult,
  deleteLabResult
} from "../controllers/labResultController.js";

const labResultRouter = express.Router();

labResultRouter.post("/", createLabResult);              // Create
labResultRouter.get("/", getAllLabResults);              // List & filter
labResultRouter.get("/:id", getLabResultById);           // Get one
labResultRouter.put("/:id", updateLabResult);            // Update
labResultRouter.delete("/:id", deleteLabResult);         // Delete

export default labResultRouter;
