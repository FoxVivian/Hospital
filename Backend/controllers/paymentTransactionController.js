import PaymentTransaction from "../models/PaymentTransactions.js";

// CREATE a new payment transaction
export const createTransaction = async (req, res) => {
  try {
    const transaction = new PaymentTransaction(req.body);
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all transactions with filters
export const getAllTransactions = async (req, res) => {
  try {
    const { status, paymentMethod, patientId, invoiceId, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (patientId) query.patientId = patientId;
    if (invoiceId) query.invoiceId = invoiceId;

    if (search) {
      query.$or = [
        { invoiceNumber: new RegExp(search, "i") },
        { patientName: new RegExp(search, "i") },
        { paymentReference: new RegExp(search, "i") },
        { transactionId: new RegExp(search, "i") },
        { receiptNumber: new RegExp(search, "i") }
      ];
    }

    const transactions = await PaymentTransaction.find(query).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findOne({ id: req.params.id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE transaction by ID
export const updateTransaction = async (req, res) => {
  try {
    const updated = await PaymentTransaction.findOneAndUpdate(
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

// DELETE transaction by ID
export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await PaymentTransaction.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
