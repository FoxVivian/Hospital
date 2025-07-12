import express from "express";
import {
  createLabNormalRange,
  getAllLabNormalRanges,
  getLabNormalRangeById,
  updateLabNormalRange,
  deleteLabNormalRange
} from "../controllers/labNormalRangeController.js";

const labNormalRangeRouter = express.Router();

labNormalRangeRouter.post("/", createLabNormalRange);            // Create
labNormalRangeRouter.get("/", getAllLabNormalRanges);            // List + filters
labNormalRangeRouter.get("/:id", getLabNormalRangeById);         // Get by ID
labNormalRangeRouter.put("/:id", updateLabNormalRange);          // Update
labNormalRangeRouter.delete("/:id", deleteLabNormalRange);       // Delete

export default labNormalRangeRouter;
