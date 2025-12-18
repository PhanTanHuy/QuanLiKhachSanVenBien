import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// Lấy thống kê tổng quan
router.get("/stats", getDashboardStats);

export default router;
