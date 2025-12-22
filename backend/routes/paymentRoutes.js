import express from "express";
import { createPaymentRecord, getPaymentByBookingCode, getPayment } from "../controllers/paymentController.js";

const router = express.Router();
// Tạo bản ghi thanh toán cho một đặt phòng
router.post("/create", createPaymentRecord);

// Lấy bản ghi thanh toán theo BookingID
router.get("/getPayment", getPayment);

// Lấy bản ghi thanh toán theo BookingID
router.get("/getPaymentByBookingCode/:bookingCode", getPaymentByBookingCode);

export default router;