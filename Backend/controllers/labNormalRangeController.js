import { LabNormalRange } from "../models/Lab/LabNormalRange.js";

// CREATE a normal range entry
export const createLabNormalRange = async (req, res) => {
  try {
    const range = new LabNormalRange(req.body);
    const saved = await range.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all normal ranges with optional filters
export const getAllLabNormalRanges = async (req, res) => {
  try {
    const { parameter, unit, ageGroup, condition, search } = req.query;
    const query = {};

    if (parameter) query.parameter = parameter;
    if (unit) query.unit = unit;
    if (ageGroup) query.ageGroup = ageGroup;
    if (condition) query.condition = condition;

    if (search) {
      query.$or = [
        { parameter: new RegExp(search, "i") },
        { unit: new RegExp(search, "i") },
        { condition: new RegExp(search, "i") },
      ];
    }

    const ranges = await LabNormalRange.find(query).sort({ parameter: 1 });
    res.json(ranges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET by ID
export const getLabNormalRangeById = async (req, res) => {
  try {
    const range = await LabNormalRange.findById(req.params.id);
    if (!range) return res.status(404).json({ message: "Range not found" });
    res.json(range);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateLabNormalRange = async (req, res) => {
  try {
    const updated = await LabNormalRange.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Range not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteLabNormalRange = async (req, res) => {
  try {
    const deleted = await LabNormalRange.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Range not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
