import ServicePrice from "../models/ServicePrice.js";

// CREATE new service price
export const createServicePrice = async (req, res) => {
  try {
    const service = new ServicePrice(req.body);
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all services with optional filters
export const getAllServicePrices = async (req, res) => {
  try {
    const { isActive, department, category, search } = req.query;
    const query = {};

    if (isActive !== undefined) query.isActive = isActive === "true";
    if (department) query.department = department;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

    const services = await ServicePrice.find(query).sort({ effectiveDate: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET service by ID
export const getServicePriceById = async (req, res) => {
  try {
    const service = await ServicePrice.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE service by ID
export const updateServicePrice = async (req, res) => {
  try {
    const updated = await ServicePrice.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE service by ID
export const deleteServicePrice = async (req, res) => {
  try {
    const deleted = await ServicePrice.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
