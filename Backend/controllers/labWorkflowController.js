import LabWorkflow from "../models/Lab/LabWorkflow.js";

// CREATE workflow step
export const createLabWorkflow = async (req, res) => {
  try {
    const workflow = new LabWorkflow(req.body);
    const saved = await workflow.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all workflow steps with filters
export const getAllLabWorkflows = async (req, res) => {
  try {
    const { testId, step, status, assignedTo } = req.query;
    const query = {};

    if (testId) query.testId = testId;
    if (step) query.step = step;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;

    const workflows = await LabWorkflow.find(query).sort({ createdAt: 1 });
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET workflow step by ID
export const getLabWorkflowById = async (req, res) => {
  try {
    const workflow = await LabWorkflow.findOne({ id: req.params.id });
    if (!workflow) return res.status(404).json({ message: "Workflow not found" });
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE workflow step by ID
export const updateLabWorkflow = async (req, res) => {
  try {
    const updated = await LabWorkflow.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Workflow not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE workflow step
export const deleteLabWorkflow = async (req, res) => {
  try {
    const deleted = await LabWorkflow.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Workflow not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
