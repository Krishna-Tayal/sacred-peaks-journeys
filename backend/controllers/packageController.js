import Package from "../models/Package.js";

export const createPackage = async (req, res) => {
  try {
    const { name, destination, price, duration, features } = req.body;
    const thumbnailImage = req.file?.path;

    if (!name || !destination || !price || !duration || !thumbnailImage) {
      return res.status(400).json({ success: false, message: "Missing required package fields." });
    }

    const featuresArray = typeof features === "string" ? features.split(",").map((f) => f.trim()).filter(Boolean) : features || [];

    const newPackage = await Package.create({
      name,
      destination,
      price,
      duration,
      features: featuresArray,
      thumbnailImage,
    });

    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create package.", error: error.message });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch packages.", error: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, destination, price, duration, features } = req.body;
    const update = { name, destination, price, duration };

    if (features) {
      update.features = typeof features === "string" ? features.split(",").map((f) => f.trim()).filter(Boolean) : features;
    }
    if (req.file?.path) {
      update.thumbnailImage = req.file.path;
    }

    const updatedPackage = await Package.findByIdAndUpdate(id, update, { new: true });
    if (!updatedPackage) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }

    res.json({ success: true, data: updatedPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update package.", error: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Package.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }
    res.json({ success: true, message: "Package deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete package.", error: error.message });
  }
};
