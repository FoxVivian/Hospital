import StockAlert from "../models/StockAlerts.js";

// CREATE a new stock alert
export const createStockAlert = async (req, res) => {
  try {
    const alert = new StockAlert(req.body);
    const saved = await alert.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all alerts with optional filters
export const getAllStockAlerts = async (req, res) => {
  try {
    const { alertType, severity, isRead, search } = req.query;
    const query = {};

    if (alertType) query.alertType = alertType;
    if (severity) query.severity = severity;
    if (isRead !== undefined) query.isRead = isRead === "true";

    if (search) {
      query.medicineName = new RegExp(search, "i");
    }

    const alerts = await StockAlert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET alert by ID
export const getStockAlertById = async (req, res) => {
  try {
    const alert = await StockAlert.findOne({ id: req.params.id });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE (mark as read or update fields)
export const updateStockAlert = async (req, res) => {
  try {
    const updated = await StockAlert.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Alert not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE alert by ID
export const deleteStockAlert = async (req, res) => {
  try {
    const deleted = await StockAlert.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Alert not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
