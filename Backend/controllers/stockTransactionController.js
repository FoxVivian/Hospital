import StockTransaction from "../models/StockTransactions.js";

// CREATE a stock transaction
export const createStockTransaction = async (req, res) => {
  try {
    const transaction = new StockTransaction(req.body);
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all stock transactions (with filters)
export const getAllStockTransactions = async (req, res) => {
  try {
    const {
      type,
      status,
      medicineId,
      supplierId,
      search,
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (medicineId) query.medicineId = medicineId;
    if (supplierId) query.supplierId = supplierId;

    if (search) {
      query.$or = [
        { medicineName: new RegExp(search, "i") },
        { batchNumber: new RegExp(search, "i") },
        { invoiceNumber: new RegExp(search, "i") },
        { referenceId: new RegExp(search, "i") },
      ];
    }

    const transactions = await StockTransaction.find(query).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a stock transaction by ID
export const getStockTransactionById = async (req, res) => {
  try {
    const transaction = await StockTransaction.findOne({ id: req.params.id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE stock transaction by ID
export const updateStockTransaction = async (req, res) => {
  try {
    const updated = await StockTransaction.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Transaction not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE stock transaction by ID
export const deleteStockTransaction = async (req, res) => {
  try {
    const deleted = await StockTransaction.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
