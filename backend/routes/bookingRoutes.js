import express from "express";
import { getAllBookings, getBookingByCode } from "../controllers/bookingController.js";

const router = express.Router();

// Lấy tất cả chi tiết đặt phòng
router.get("/", getAllBookings);

// Lấy chi tiết đặt phòng theo mã đặt phòng
router.get("/:code", getBookingByCode);

export default router;
