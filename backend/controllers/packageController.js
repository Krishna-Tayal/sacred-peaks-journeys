import Package from "../models/Package.js";

const parseDestinations = (value) => {
  if (Array.isArray(value)) {
    return value.map((d) => String(d).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((d) => d.trim()).filter(Boolean);
  }

  return [];
};

const parseFacilities = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const parsed = JSON.parse(value || "[]");
    if (!Array.isArray(parsed)) {
      throw new Error("Facilities must be a JSON array.");
    }
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  }

  return [];
};

export const createPackage = async (req, res) => {
  try {
    const { name, destinations, price, duration, description } = req.body;
    const thumbnailImage = req.file?.path;
    const destinationsArray = parseDestinations(destinations);
    let facilitiesArray = [];

    try {
      facilitiesArray = parseFacilities(req.body.facilities);
    } catch (parseError) {
      return res.status(400).json({ success: false, message: parseError.message });
    }

    if (!name || destinationsArray.length === 0 || !price || !duration || !description || !thumbnailImage) {
      return res.status(400).json({ success: false, message: "Missing required package fields." });
    }

    const newPackage = await Package.create({
      name,
      destinations: destinationsArray,
      price,
      duration,
      description,
      facilities: facilitiesArray,
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
    const { name, destinations, price, duration, description } = req.body;
    const update = { name, price, duration, description };

    if (destinations !== undefined) {
      update.destinations = parseDestinations(destinations);
    }

    if (req.body.facilities !== undefined) {
      try {
        update.facilities = parseFacilities(req.body.facilities);
      } catch (parseError) {
        return res.status(400).json({ success: false, message: parseError.message });
      }
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
