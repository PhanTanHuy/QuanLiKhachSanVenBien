import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    userName: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
