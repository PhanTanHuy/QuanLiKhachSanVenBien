import express from "express";
import { getDashboardStats, getRevenueChart, getBookingChart } from "../controllers/dashboardController.js";

const router = express.Router();

// Lấy thống kê tổng quan
router.get("/stats", getDashboardStats);

// Lấy dữ liệu biểu đồ doanh thu
router.get("/revenue-chart", getRevenueChart);

// Lấy dữ liệu biểu đồ lượt đặt phòng
router.get("/booking-chart", getBookingChart);

export default router;
