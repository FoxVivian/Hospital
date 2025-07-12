import express from "express";
import {
  createLabWorkflow,
  getAllLabWorkflows,
  getLabWorkflowById,
  updateLabWorkflow,
  deleteLabWorkflow
} from "../controllers/labWorkflowController.js";

const labWorkflowRouter = express.Router();

labWorkflowRouter.post("/", createLabWorkflow);             // Create
labWorkflowRouter.get("/", getAllLabWorkflows);             // List/filter
labWorkflowRouter.get("/:id", getLabWorkflowById);          // Get one
labWorkflowRouter.put("/:id", updateLabWorkflow);           // Update
labWorkflowRouter.delete("/:id", deleteLabWorkflow);        // Delete

export default labWorkflowRouter;
