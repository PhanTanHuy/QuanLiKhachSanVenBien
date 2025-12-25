import express from "express";
import {
  createBooking,
  updateBooking,
  getAllBookings,
  getBookingByCode,
  getBookingsByRoom,
  getBookingsByUser,
  getRevenue,
} from "../controllers/bookingController.js";
import { PaymentMethod } from "../configs/enum/paymentEnum.js";
import { RoomStatus } from "../configs/enum/roomEnum.js";

const router = express.Router();

// Tạo booking mới
router.post("/", createBooking);

// Cập nhật chi tiết đặt phòng
router.put("/:bookingId", updateBooking);
// Tạo booking mới cho user
router.post("/", protectedRoute, createBookingByUser);
// Lấy danh sách booking của user hiện tại
router.get("/my", protectedRoute, getMyBookings);
// Hủy đặt phòng
router.patch("/cancel/:bookingCode", protectedRoute, cancelBooking);

// Lấy tất cả chi tiết đặt phòng
router.get("/", getAllBookings);

// Lấy chi tiết đặt phòng theo mã đặt phòng
router.get("/getOne/:code", getBookingByCode);

// Lấy danh sách booking theo roomId hoặc room code
router.get("/by-room/:roomIdentifier", getBookingsByRoom);

// Lấy danh sách booking theo userId hoặc email
router.get("/by-user/:userIdentifier", getBookingsByUser);

// Lấy tổng danh thu
router.get("/revenue", getRevenue);

// Lấy enum phương thức thanh toán
router.get("/enum/payment-methods", (req, res) => {
  res.status(200).json({ paymentMethods: PaymentMethod });
});

// Lấy enum trạng thái booking (chỉ có Đã đặt cọc và Đang thuê)
router.get("/enum/booking-statuses", (req, res) => {
  res.status(200).json({ 
    bookingStatuses: {
      RESERVED: RoomStatus.RESERVED,
      OCCUPIED: RoomStatus.OCCUPIED
    }
  });
});

export default router;