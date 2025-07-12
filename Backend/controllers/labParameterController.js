import LabParameter from "../models/Lab/LabParameter.js";
import { LabNormalRange } from "../models/Lab/LabNormalRange.js";

// CREATE
export const createLabParameter = async (req, res) => {
  try {
    const {
      id,
      name,
      unit,
      method,
      normalRanges,
      criticalValues,
      isRequired,
      order
    } = req.body;

    let parsedRanges = [];

    // ✅ Parse nếu là string
    if (typeof normalRanges === 'string') {
      try {
        parsedRanges = JSON.parse(normalRanges);
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON string in normalRanges" });
      }
    } else if (Array.isArray(normalRanges)) {
      parsedRanges = normalRanges;
    }

    const normalRangeIds = [];

    if (Array.isArray(parsedRanges)) {
      for (const range of parsedRanges) {
        const newRange = await LabNormalRange.create(range);
        normalRangeIds.push(newRange._id);
      }
    }

    const newParameter = new LabParameter({
      id,
      name,
      unit,
      method,
      normalRanges: normalRangeIds,
      criticalValues,
      isRequired,
      order
    });

    const saved = await newParameter.save();
    const populated = await saved.populate("normalRanges");

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// GET ALL with filters & populated normalRanges
export const getAllLabParameters = async (req, res) => {
  try {
    const { name, unit, method, search } = req.query;
    const query = {};

    if (name) query.name = new RegExp(name, "i");
    if (unit) query.unit = unit;
    if (method) query.method = method;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { unit: new RegExp(search, "i") },
        { method: new RegExp(search, "i") }
      ];
    }

    const parameters = await LabParameter.find(query)
      .populate("normalRanges")
      .sort({ order: 1 });

    res.json(parameters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE by ID with populated ranges
export const getLabParameterById = async (req, res) => {
  try {
    const parameter = await LabParameter.findOne({ id: req.params.id })
      .populate("normalRanges");

    if (!parameter) return res.status(404).json({ message: "Parameter not found" });
    res.json(parameter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateLabParameter = async (req, res) => {
  try {
    const updated = await LabParameter.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    ).populate("normalRanges");

    if (!updated) return res.status(404).json({ message: "Parameter not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteLabParameter = async (req, res) => {
  try {
    const deleted = await LabParameter.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Parameter not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
