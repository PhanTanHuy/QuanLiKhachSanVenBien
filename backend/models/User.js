import mongoose from "mongoose";
import { UserRole } from "../configs/enum/userEnum.js";

const userSchema = new mongoose.Schema(
  {
    hashedPassword: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String },
    cccd: { type: String, unique: true, sparse: true },
    address: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    // --- reset password ---
    resetPasswordToken: { type: String, index: true, sparse: true },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
