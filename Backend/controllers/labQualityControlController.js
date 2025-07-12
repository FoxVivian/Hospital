import LabQualityControl from "../models/Lab/LabQualityControl.js";

// CREATE a QC record
export const createQualityControl = async (req, res) => {
  try {
    const qc = new LabQualityControl(req.body);
    const saved = await qc.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all QC records with optional filters
export const getAllQualityControls = async (req, res) => {
  try {
    const { testType, controlLevel, equipmentId, isWithinRange, performedBy, search } = req.query;
    const query = {};

    if (testType) query.testType = new RegExp(testType, "i");
    if (controlLevel) query.controlLevel = controlLevel;
    if (equipmentId) query.equipmentId = equipmentId;
    if (isWithinRange !== undefined) query.isWithinRange = isWithinRange === "true";
    if (performedBy) query.performedBy = new RegExp(performedBy, "i");

    if (search) {
      query.$or = [
        { batchNumber: new RegExp(search, "i") },
        { notes: new RegExp(search, "i") },
        { testType: new RegExp(search, "i") }
      ];
    }

    const records = await LabQualityControl.find(query).sort({ performedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET QC by ID
export const getQualityControlById = async (req, res) => {
  try {
    const qc = await LabQualityControl.findOne({ id: req.params.id });
    if (!qc) return res.status(404).json({ message: "QC record not found" });
    res.json(qc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE QC record by ID
export const updateQualityControl = async (req, res) => {
  try {
    const updated = await LabQualityControl.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "QC record not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE QC record by ID
export const deleteQualityControl = async (req, res) => {
  try {
    const deleted = await LabQualityControl.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "QC record not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
