import express from "express";
import {
  createStats,
  getLatestStats,
  getStatsHistory,
  updateStats,
  deleteStats,
} from "../controllers/dashboardStatsController.js";

const dashboardStatsRouter = express.Router();

dashboardStatsRouter.post("/", createStats);                // POST /api/dashboard
dashboardStatsRouter.get("/latest", getLatestStats);        // GET  /api/dashboard/latest
dashboardStatsRouter.get("/history", getStatsHistory);      // GET  /api/dashboard/history
dashboardStatsRouter.put("/:id", updateStats);              // PUT  /api/dashboard/:id
dashboardStatsRouter.delete("/:id", deleteStats);           // DELETE /api/dashboard/:id

export default dashboardStatsRouter;
