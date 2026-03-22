import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destinations: [{ type: String, required: true }],
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    facilities: [{ type: String }],
    thumbnailImage: { type: String, required: true },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);
export default Package;
