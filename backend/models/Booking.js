import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    travelDate: { type: Date, required: true },
    travelers: { type: Number, required: true },
    selectedPackage: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
