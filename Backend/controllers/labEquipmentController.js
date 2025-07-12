import LabEquipment from "../models/Lab/LabEquipment.js";

// CREATE lab equipment
export const createLabEquipment = async (req, res) => {
  try {
    const equipment = new LabEquipment(req.body);
    const saved = await equipment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all equipment with filters
export const getAllLabEquipment = async (req, res) => {
  try {
    const { status, type, location, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (location) query.location = location;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { model: new RegExp(search, "i") },
        { serialNumber: new RegExp(search, "i") }
      ];
    }

    const equipments = await LabEquipment.find(query).sort({ createdAt: -1 });
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single equipment by ID
export const getLabEquipmentById = async (req, res) => {
  try {
    const equipment = await LabEquipment.findOne({ id: req.params.id });
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE equipment
export const updateLabEquipment = async (req, res) => {
  try {
    const updated = await LabEquipment.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Equipment not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE equipment
export const deleteLabEquipment = async (req, res) => {
  try {
    const deleted = await LabEquipment.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Equipment not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
