import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
export default GalleryImage;
