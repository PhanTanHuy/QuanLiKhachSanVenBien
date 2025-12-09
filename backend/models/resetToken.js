import mongoose from "mongoose";

const resetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// tự xoá khi hết hạn
resetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("ResetToken", resetSchema);
