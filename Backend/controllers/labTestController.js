import {LabTest} from "../models/Lab/LabTest.js";

// CREATE lab test
export const createLabTest = async (req, res) => {
  try {
    const test = new LabTest(req.body);
    const saved = await test.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all lab tests with filters
export const getAllLabTests = async (req, res) => {
  try {
    const { status, testType, patientId, search, priority } = req.query;
    const query = {};

    if (status) query.status = status;
    if (testType) query.testType = testType;
    if (priority) query.priority = priority;
    if (patientId) query.patientId = patientId;

    if (search) {
      query.$or = [
        { code: new RegExp(search, "i") },
        { patientName: new RegExp(search, "i") },
        { patientPhone: new RegExp(search, "i") },
        { testCode: new RegExp(search, "i") },
        { department: new RegExp(search, "i") }
      ];
    }

    const tests = await LabTest.find(query).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET one lab test by ID
export const getLabTestById = async (req, res) => {
  try {
    const test = await LabTest.findOne({ id: req.params.id });
    if (!test) return res.status(404).json({ message: "Lab test not found" });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE lab test
export const updateLabTest = async (req, res) => {
  try {
    const updated = await LabTest.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Lab test not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE lab test
export const deleteLabTest = async (req, res) => {
  try {
    const deleted = await LabTest.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Lab test not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
