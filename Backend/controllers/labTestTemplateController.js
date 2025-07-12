import LabTestTemplate from "../models/Lab/LabTestTemplate.js";
import LabParameter from "../models/Lab/LabParameter.js";

// CREATE
export const createLabTestTemplate = async (req, res) => {
  try {
    const {
      id,
      code,
      name,
      category,
      department,
      sampleType,
      parameters,
      price,
      insurancePrice,
      turnaroundTime,
      preparationInstructions,
      description,
      isActive
    } = req.body;

    // Tạo từng LabParameter và thu _id
    const parameterIds = [];

    for (const param of parameters) {
      const newParam = await LabParameter.create({
        id: param.id,
        name: param.name,
        unit: param.unit,
        method: param.method || null,
        normalRanges: param.normalRanges || [],
        criticalValues: param.criticalValues || {},
        isRequired: param.isRequired ?? true,
        order: param.order
      });
      parameterIds.push(newParam._id);
    }

    // Tạo LabTestTemplate và gán parameterIds
    const template = new LabTestTemplate({
      id,
      code,
      name,
      category,
      department,
      sampleType,
      parameters: parameterIds,
      price,
      insurancePrice,
      turnaroundTime,
      preparationInstructions,
      description,
      isActive
    });

    const saved = await template.save();
    const populated = await saved.populate("parameters");

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// GET ALL with filters & populated parameters
export const getAllLabTestTemplates = async (req, res) => {
  try {
    const { category, department, isActive, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { sampleType: new RegExp(search, "i") }
      ];
    }

    const templates = await LabTestTemplate.find(query)
      .populate("parameters")
      .sort({ name: 1 });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ONE by ID with populated parameters
export const getLabTestTemplateById = async (req, res) => {
  try {
    const template = await LabTestTemplate.findOne({ id: req.params.id })
      .populate("parameters");
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateLabTestTemplate = async (req, res) => {
  try {
    const updated = await LabTestTemplate.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    ).populate("parameters");

    if (!updated) return res.status(404).json({ message: "Template not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
export const deleteLabTestTemplate = async (req, res) => {
  try {
    const deleted = await LabTestTemplate.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Template not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
