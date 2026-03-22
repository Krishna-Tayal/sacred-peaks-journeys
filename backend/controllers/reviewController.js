import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { name, city, rating, message } = req.body;

    if (!name || !city || !rating || !message) {
      return res.status(400).json({ success: false, message: "Missing required review fields." });
    }

    const review = await Review.create({
      name,
      city,
      rating,
      message,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create review.", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews.", error: error.message });
  }
};
