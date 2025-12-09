import express from "express";
import { createBooking, getAllBookings, getBookingByCode, getRevenue } from "../controllers/bookingController.js";
import { PaymentMethod } from "../configs/enum/paymentEnum.js";
import { BookingStatus } from "../configs/enum/bookingStatusEnum.js";

const router = express.Router();

// Tạo booking mới
router.post("/", createBooking);

// Lấy tất cả chi tiết đặt phòng
router.get("/", getAllBookings);

// Lấy chi tiết đặt phòng theo mã đặt phòng
router.get("/getOne/:code", getBookingByCode);

// Lấy tổng danh thu
router.get("/revenue", getRevenue);

// Lấy enum phương thức thanh toán
router.get("/enum/payment-methods", (req, res) => {
  res.status(200).json({ paymentMethods: PaymentMethod });
});

// Lấy enum trạng thái đặt phòng
router.get("/enum/booking-statuses", (req, res) => {
  res.status(200).json({ bookingStatuses: BookingStatus });
});

export default router;
