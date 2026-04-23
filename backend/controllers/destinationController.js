import Destination from "../models/Destination.js";

const generateSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export const createDestination = async (req, res) => {
  try {
    const { name, description, bestTimeToVisit, bestTime, altitude } = req.body;
    const resolvedBestTime = bestTimeToVisit || bestTime;
    const thumbnailImage = req.files?.thumbnailImage?.[0]?.path;
    const galleryImages = req.files?.galleryImages?.map((f) => f.path) || [];

    if (!name || !description || !resolvedBestTime || !altitude || !thumbnailImage) {
      return res.status(400).json({ success: false, message: "Missing required destination fields." });
    }

    const baseSlug = generateSlug(name) || `destination-${Date.now()}`;
    let slug = baseSlug;
    const existing = await Destination.findOne({ slug: baseSlug });
    if (existing) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const destination = await Destination.create({
      name,
      slug,
      description,
      bestTime: resolvedBestTime,
      altitude,
      thumbnailImage,
      galleryImages,
    });

    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create destination.", error: error.message });
  }
};

export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json({ success: true, data: destinations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch destinations.", error: error.message });
  }
};

export const getDestinationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const destination = await Destination.findOne({ slug });
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }
    res.json({ success: true, data: destination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch destination.", error: error.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, bestTimeToVisit, bestTime, altitude } = req.body;
    const resolvedBestTime = bestTimeToVisit || bestTime;

    const update = { name, slug, description, bestTime: resolvedBestTime, altitude };
    if (req.files?.thumbnailImage?.[0]?.path) {
      update.thumbnailImage = req.files.thumbnailImage[0].path;
    }
    if (req.files?.galleryImages) {
      const galleryImages = req.files.galleryImages.map((f) => f.path);
      update.galleryImages = galleryImages;
    }

    const destination = await Destination.findByIdAndUpdate(id, update, { new: true });
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }

    res.json({ success: true, data: destination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update destination.", error: error.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByIdAndDelete(id);
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found." });
    }
    res.json({ success: true, message: "Destination deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete destination.", error: error.message });
  }
};
