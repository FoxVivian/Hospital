import express from "express";
import {
  createLabParameter,
  getAllLabParameters,
  getLabParameterById,
  updateLabParameter,
  deleteLabParameter
} from "../controllers/labParameterController.js";

const labParameterRouter = express.Router();

labParameterRouter.post("/", createLabParameter);             // Create
labParameterRouter.get("/", getAllLabParameters);             // List/filter/populate
labParameterRouter.get("/:id", getLabParameterById);          // Get one
labParameterRouter.put("/:id", updateLabParameter);           // Update
labParameterRouter.delete("/:id", deleteLabParameter);        // Delete

export default labParameterRouter;
