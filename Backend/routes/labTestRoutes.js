import express from "express";
import {
  createLabTest,
  getAllLabTests,
  getLabTestById,
  updateLabTest,
  deleteLabTest
} from "../controllers/labTestController.js";

const labTestRouter = express.Router();

labTestRouter.post("/", createLabTest);             // Create
labTestRouter.get("/", getAllLabTests);             // List & filter
labTestRouter.get("/:id", getLabTestById);          // Get one
labTestRouter.put("/:id", updateLabTest);           // Update
labTestRouter.delete("/:id", deleteLabTest);        // Delete

export default labTestRouter;
