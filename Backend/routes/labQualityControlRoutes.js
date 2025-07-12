import express from "express";
import {
  createQualityControl,
  getAllQualityControls,
  getQualityControlById,
  updateQualityControl,
  deleteQualityControl
} from "../controllers/labQualityControlController.js";

const labQualityControlRouter = express.Router();

labQualityControlRouter.post("/", createQualityControl);             // Create
labQualityControlRouter.get("/", getAllQualityControls);             // List/filter
labQualityControlRouter.get("/:id", getQualityControlById);          // Get one
labQualityControlRouter.put("/:id", updateQualityControl);           // Update
labQualityControlRouter.delete("/:id", deleteQualityControl);        // Delete

export default labQualityControlRouter;
