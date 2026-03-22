import express from "express";
import { createBooking, getAllBookings, updateBookingStatus } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.put("/:id", updateBookingStatus);

export default router;
