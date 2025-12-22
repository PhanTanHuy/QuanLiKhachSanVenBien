import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingDetail",
      required: true,
    },

    bookingCode: {
      type: String,
      required: true,
    },

    amount: { type: Number, required: true },
    depositAmount: { type: Number },
    totalPrice: { type: Number, required: true },

    paymentMethod: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentTable", paymentSchema);
