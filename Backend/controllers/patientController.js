import Patient from "../models/Patients.js";

// CREATE patient
export const createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const saved = await patient.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all patients (with optional filters)
export const getAllPatients = async (req, res) => {
  try {
    const { status, search, insuranceId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (insuranceId) query.insuranceId = insuranceId;

    if (search) {
      query.$or = [
        { fullName: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { identityCard: new RegExp(search, "i") },
        { code: new RegExp(search, "i") }
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE patient by ID
export const updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE patient by ID
export const deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
