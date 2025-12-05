import express from "express";
import { getAllBookings, getBookingByCode, getRevenue } from "../controllers/bookingController.js";

const router = express.Router();

// Lấy tất cả chi tiết đặt phòng
router.get("/", getAllBookings);

// Lấy chi tiết đặt phòng theo mã đặt phòng
router.get("/getOne/:code", getBookingByCode);

// Lấy tổng danh thu
router.get("/revenue", getRevenue);

export default router;
