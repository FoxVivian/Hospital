import Supplier from "../models/Suppliers.js";

// CREATE supplier
export const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const saved = await supplier.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all suppliers (with optional filters)
export const getAllSuppliers = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { contactPerson: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
        { taxCode: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { bankName: new RegExp(search, "i") }
      ];
    }

    const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ id: req.params.id });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE supplier by ID
export const updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Supplier not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE supplier by ID
export const deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
