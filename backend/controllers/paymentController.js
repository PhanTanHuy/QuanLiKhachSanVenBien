import PaymentTable from "../models/PaymentTable.js";
import BookingDetail from "../models/BookingDetail.js";
import { v4 as uuidv4 } from "uuid";

// Tạo bản ghi thanh toán khi tạo đặt phòng
export const createPaymentRecord = async (req, res) => {
  try {
    console.log("Dữ liệu thanh toán nhận được:", req.body);
    const { BookingID, Amount, PaymentMethod, DepositAmount, TotalPrice } =
      req.body;

    const booking = await BookingDetail.findOne({
      bookingCode: BookingID,
    });
    const payment = await PaymentTable.create({
      booking: booking._id,
      bookingCode: BookingID,
      amount: Amount,
      paymentMethod: PaymentMethod,
      depositAmount: DepositAmount || 0,
      paymentDate: new Date(),
      totalPrice: TotalPrice,
      paymentStatus: "Đã thanh toán",
    });

    await payment.save();

    console.log("✅ Bản ghi thanh toán đã được tạo thành công");

    return res.status(200).json({ message: "Thanh toán thành công", payment });
  } catch (err) {
    console.error("Lỗi khi tạo bản ghi thanh toán:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Lấy bản ghi thanh toán theo BookingID
export const getPaymentByBookingCode = async (req, res) => {
  try {
    const { bookingCode } = req.params;

    const payment = await PaymentTable.findOne({
      bookingCode: bookingCode.trim(),
    });

    if (!payment) {
      return res.status(404).json({
        message: "Không tìm thấy bản ghi thanh toán",
      });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Lỗi khi lấy bản ghi thanh toán:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await PaymentTable.find();
    return res.status(200).json(payment);
  } catch (error) {
    console.error("Lỗi khi lấy bản ghi thanh toán:", error);
    return res.status(500).json({ message: error.message });
  }
};
