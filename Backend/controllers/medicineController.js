import Medicine from "../models/Medicines.js";

// CREATE a new medicine
export const createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const saved = await medicine.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all medicines with optional filters
export const getAllMedicines = async (req, res) => {
  try {
    const { status, category, supplierId, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (supplierId) query.supplierId = supplierId;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { batchNumber: new RegExp(search, "i") },
        { supplier: new RegExp(search, "i") },
        { activeIngredient: new RegExp(search, "i") }
      ];
    }

    const medicines = await Medicine.find(query).sort({ expiryDate: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ id: req.params.id });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE medicine by ID
export const updateMedicine = async (req, res) => {
  try {
    const updated = await Medicine.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Medicine not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE medicine by ID
export const deleteMedicine = async (req, res) => {
  try {
    const deleted = await Medicine.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
