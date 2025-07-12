import Invoice from "../models/Invoices.js";

// CREATE new invoice
export const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all invoices (filter/search support)
export const getAllInvoices = async (req, res) => {
  try {
    const { patientName, status, paymentMethod, search } = req.query;
    const query = {};

    if (patientName) query.patientName = new RegExp(patientName, "i");
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    if (search) {
      query.$or = [
        { invoiceNumber: new RegExp(search, "i") },
        { patientName: new RegExp(search, "i") },
        { patientPhone: new RegExp(search, "i") },
      ];
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE invoice by ID
export const updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE invoice by ID
export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
