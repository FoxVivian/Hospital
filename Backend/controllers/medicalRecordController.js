import MedicalRecord from "../models/MedicalRecords.js";

// CREATE medical record
export const createMedicalRecord = async (req, res) => {
  try {
    const record = new MedicalRecord(req.body);
    const saved = await record.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all medical records with filters
export const getAllMedicalRecords = async (req, res) => {
  try {
    const { patientId, doctorId, status, search } = req.query;
    const query = {};

    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { patientName: new RegExp(search, "i") },
        { doctorName: new RegExp(search, "i") },
        { diagnosis: new RegExp(search, "i") },
        { treatment: new RegExp(search, "i") }
      ];
    }

    const records = await MedicalRecord.find(query).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET one medical record by ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ id: req.params.id });
    if (!record) return res.status(404).json({ message: "Medical record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET medical record by appointmentId
export const getMedicalRecordByAppointmentId = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ appointmentId: req.params.appointmentId });
    if (!record) return res.status(404).json({ message: "Not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE medical record by ID
export const updateMedicalRecord = async (req, res) => {
  try {
    const updated = await MedicalRecord.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE medical record by ID
export const deleteMedicalRecord = async (req, res) => {
  try {
    const deleted = await MedicalRecord.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
