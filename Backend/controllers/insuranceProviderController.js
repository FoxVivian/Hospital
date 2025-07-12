import InsuranceProviderModel from "../models/InsuranceProvider.js";

// CREATE insurance provider
export const createProvider = async (req, res) => {
  try {
    const provider = new InsuranceProviderModel(req.body);
    const saved = await provider.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all providers with optional filters
export const getAllProviders = async (req, res) => {
  try {
    const { status, name, code, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (code) query.code = code;
    if (name) query.name = new RegExp(name, "i");
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { contactPerson: new RegExp(search, "i") }
      ];
    }

    const providers = await InsuranceProviderModel.find(query).sort({ createdAt: -1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single provider by `id`
export const getProviderById = async (req, res) => {
  try {
    const provider = await InsuranceProviderModel.findOne({ id: req.params.id });
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE provider by `id`
export const updateProvider = async (req, res) => {
  try {
    const updated = await InsuranceProviderModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Provider not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE provider by `id`
export const deleteProvider = async (req, res) => {
  try {
    const deleted = await InsuranceProviderModel.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
