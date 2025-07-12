import DashboardStats from "../models/DashboardStats.js";

// Create stats entry
export const createStats = async (req, res) => {
  try {
    const stats = new DashboardStats(req.body);
    const saved = await stats.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get latest stats (for dashboard)
export const getLatestStats = async (req, res) => {
  try {
    const latest = await DashboardStats.findOne().sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ message: "No stats found" });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all stats (history)
export const getStatsHistory = async (req, res) => {
  try {
    const history = await DashboardStats.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update specific stats entry by ID
export const updateStats = async (req, res) => {
  try {
    const updated = await DashboardStats.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete stats by ID
export const deleteStats = async (req, res) => {
  try {
    const deleted = await DashboardStats.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
