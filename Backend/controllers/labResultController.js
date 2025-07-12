import {LabResult} from "../models/Lab/LabResult.js";

// CREATE a lab result
export const createLabResult = async (req, res) => {
  try {
    const result = new LabResult(req.body);
    const saved = await result.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all lab results with optional filters
export const getAllLabResults = async (req, res) => {
  try {
    const { parameter, status, instrument, method, search } = req.query;
    const query = {};

    if (parameter) query.parameter = new RegExp(parameter, "i");
    if (status) query.status = status;
    if (instrument) query.instrument = new RegExp(instrument, "i");
    if (method) query.method = new RegExp(method, "i");

    if (search) {
      query.$or = [
        { parameter: new RegExp(search, "i") },
        { value: new RegExp(search, "i") },
        { instrument: new RegExp(search, "i") },
        { notes: new RegExp(search, "i") }
      ];
    }

    const results = await LabResult.find(query).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET one lab result by ID
export const getLabResultById = async (req, res) => {
  try {
    const result = await LabResult.findOne({ id: req.params.id });
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE lab result by ID
export const updateLabResult = async (req, res) => {
  try {
    const updated = await LabResult.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Result not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE lab result by ID
export const deleteLabResult = async (req, res) => {
  try {
    const deleted = await LabResult.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Result not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
