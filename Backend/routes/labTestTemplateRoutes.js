import express from "express";
import {
  createLabTestTemplate,
  getAllLabTestTemplates,
  getLabTestTemplateById,
  updateLabTestTemplate,
  deleteLabTestTemplate
} from "../controllers/labTestTemplateController.js";

const labTestTemplateRouter = express.Router();

labTestTemplateRouter.post("/", createLabTestTemplate);             // Create
labTestTemplateRouter.get("/", getAllLabTestTemplates);             // List/filter
labTestTemplateRouter.get("/:id", getLabTestTemplateById);          // Get one
labTestTemplateRouter.put("/:id", updateLabTestTemplate);           // Update
labTestTemplateRouter.delete("/:id", deleteLabTestTemplate);        // Delete

export default labTestTemplateRouter;
