import Review from "../models/Review.js";

export const getReviewsByRoom = async (req, res) => {
  try {
    const reviews = await Review.find({ roomId: req.params.roomId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
