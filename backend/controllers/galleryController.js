import GalleryImage from "../models/GalleryImage.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }

    const imagePath = req.file.path;
    const { title } = req.body;

    const image = await GalleryImage.create({
      image: imagePath,
      title: title || "",
    });

    return res.status(201).json({ success: true, data: image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to upload gallery image.", error: error.message });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch gallery images.", error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await GalleryImage.findByIdAndDelete(id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Gallery image not found." });
    }
    return res.json({ success: true, data: image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to delete gallery image.", error: error.message });
  }
};
