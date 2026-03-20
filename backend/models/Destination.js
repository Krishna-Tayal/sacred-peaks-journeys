import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    bestTime: { type: String, required: true },
    altitude: { type: String, required: true },
    thumbnailImage: { type: String, required: true },
    galleryImages: [{ type: String }],
  },
  { timestamps: true }
);

const Destination = mongoose.model("Destination", destinationSchema);
export default Destination;
