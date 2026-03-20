import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, travelDate, travelers, selectedPackage } = req.body;
    if (!name || !email || !phone || !travelDate || !travelers || !selectedPackage) {
      return res.status(400).json({ success: false, message: "Missing required booking fields." });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      travelDate,
      travelers,
      selectedPackage,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create booking.", error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).populate("selectedPackage");
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings.", error: error.message });
  }
};
