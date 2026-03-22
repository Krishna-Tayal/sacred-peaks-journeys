import Booking from "../models/Booking.js";

const ALLOWED_STATUS = ["pending", "confirmed", "completed"];

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, package: packageName, travelers, date } = req.body;
    if (!name || !email || !phone || !packageName || !travelers || !date) {
      return res.status(400).json({ success: false, message: "Missing required booking fields." });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      package: packageName,
      travelers,
      date,
      status: "pending",
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create booking.", error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings.", error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: pending, confirmed, completed.",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update booking status.", error: error.message });
  }
};
