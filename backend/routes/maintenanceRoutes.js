import express from "express";
import {
    createMaintenance,
    getAllMaintenances,
    getMaintenanceByCode,
    getMaintenancesByRoom,
    completeMaintenance,
    updateMaintenance,
    deleteMaintenance
} from "../controllers/maintenanceController.js";

const router = express.Router();

// Tạo lịch bảo trì mới
router.post("/", createMaintenance);

// Lấy tất cả lịch bảo trì (có thể filter theo status)
router.get("/", getAllMaintenances);

// Lấy lịch bảo trì theo mã
router.get("/:code", getMaintenanceByCode);

// Lấy lịch bảo trì theo phòng (roomId hoặc roomCode)
router.get("/by-room/:roomIdentifier", getMaintenancesByRoom);

// Hoàn thành bảo trì (chuyển status thành "Hoàn thành" và trạng thái phòng về "Trống")
router.patch("/:code/complete", completeMaintenance);

// Cập nhật lịch bảo trì
router.put("/:code", updateMaintenance);

// Xóa lịch bảo trì
router.delete("/:code", deleteMaintenance);

export default router;
