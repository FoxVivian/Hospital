import Prescription from "../models/Prescriptions.js";

// CREATE prescription
export const createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    const saved = await prescription.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all prescriptions (with optional filters)
export const getAllPrescriptions = async (req, res) => {
  try {
    const { medicineId, medicineName, search } = req.query;
    const query = {};

    if (medicineId) query.medicineId = medicineId;
    if (medicineName) query.medicineName = new RegExp(medicineName, "i");

    if (search) {
      query.$or = [
        { medicineName: new RegExp(search, "i") },
        { dosage: new RegExp(search, "i") },
        { frequency: new RegExp(search, "i") }
      ];
    }

    const prescriptions = await Prescription.find(query).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single prescription by ID
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ id: req.params.id });
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE prescription by ID
export const updatePrescription = async (req, res) => {
  try {
    const updated = await Prescription.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Prescription not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE prescription by ID
export const deletePrescription = async (req, res) => {
  try {
    const deleted = await Prescription.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Prescription not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
