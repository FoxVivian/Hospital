import {InvoiceItem} from "../models/InvoiceItem.js";

// CREATE an invoice item
export const createInvoiceItem = async (req, res) => {
  try {
    const item = new InvoiceItem(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all invoice items (with filters)
export const getAllInvoiceItems = async (req, res) => {
  try {
    const { type, doctorId, code, search } = req.query;

    const query = {};
    if (type) query.type = type;
    if (doctorId) query.doctorId = doctorId;
    if (code) query.code = code;
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { code: new RegExp(search, "i") }
      ];
    }

    const items = await InvoiceItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET one invoice item by ID
export const getInvoiceItemById = async (req, res) => {
  try {
    const item = await InvoiceItem.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE invoice item by ID
export const updateInvoiceItem = async (req, res) => {
  try {
    const updated = await InvoiceItem.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE invoice item by ID
export const deleteInvoiceItem = async (req, res) => {
  try {
    const deleted = await InvoiceItem.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
