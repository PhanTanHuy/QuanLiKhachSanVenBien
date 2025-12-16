import Maintenance from "../models/Maintenance.js";
import Room from "../models/Room.js";
import { RoomStatus } from "../configs/enum/roomEnum.js";

// Tạo lịch bảo trì mới
export const createMaintenance = async (req, res) => {
    try {
        const { startDate, endDate, reason, roomId } = req.body;

        // Kiểm tra phòng tồn tại
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng"
            });
        }

        // Kiểm tra phòng phải trống
        if (room.status !== RoomStatus.AVAILABLE) {
            return res.status(400).json({
                success: false,
                message: `Phòng phải ở trạng thái Trống mới có thể bảo trì. Trạng thái hiện tại: ${room.status}`
            });
        }

        // Kiểm tra phòng có đang trong lịch bảo trì khác không
        const existingMaintenance = await Maintenance.findOne({
            room: roomId,
            status: "Đang bảo trì"
        });

        if (existingMaintenance) {
            return res.status(400).json({
                success: false,
                message: "Phòng đang trong lịch bảo trì khác"
            });
        }

        // Tạo snapshot của phòng
        const roomSnapshot = {
            roomCode: room.id,  // Sử dụng room.id làm roomCode (101, 102,...)
            roomType: room.type,
            floor: room.floor
        };

        // Tạo lịch bảo trì
        const maintenance = new Maintenance({
            startDate,
            endDate,
            reason,
            room: roomId,
            roomSnapshot
        });

        await maintenance.save();

        // Cập nhật trạng thái phòng
        room.status = RoomStatus.MAINTENANCE;
        await room.save();

        const populatedMaintenance = await Maintenance.findById(maintenance._id).populate("room");

        res.status(201).json({
            success: true,
            message: "Tạo lịch bảo trì thành công",
            maintenance: populatedMaintenance
        });
    } catch (err) {
        console.error("Lỗi tạo lịch bảo trì:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi tạo lịch bảo trì",
            error: err.message
        });
    }
};

// Lấy tất cả lịch bảo trì
export const getAllMaintenances = async (req, res) => {
    try {
        const { status } = req.query;
        
        const filter = {};
        if (status) {
            filter.status = status;
        }

        const maintenances = await Maintenance.find(filter)
            .populate("room")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: maintenances.length,
            maintenances
        });
    } catch (err) {
        console.error("Lỗi lấy danh sách bảo trì:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách bảo trì",
            error: err.message
        });
    }
};

// Lấy lịch bảo trì theo mã
export const getMaintenanceByCode = async (req, res) => {
    try {
        const { code } = req.params;

        const maintenance = await Maintenance.findOne({ maintenanceCode: code }).populate("room");

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy lịch bảo trì"
            });
        }

        res.status(200).json({
            success: true,
            maintenance
        });
    } catch (err) {
        console.error("Lỗi lấy lịch bảo trì:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy lịch bảo trì",
            error: err.message
        });
    }
};

// Lấy lịch bảo trì theo phòng
export const getMaintenancesByRoom = async (req, res) => {
    try {
        const { roomIdentifier } = req.params;

        // Tìm phòng theo ID hoặc mã phòng
        let room;
        if (roomIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
            room = await Room.findById(roomIdentifier);
        } else {
            room = await Room.findOne({ roomCode: roomIdentifier });
        }

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng"
            });
        }

        const maintenances = await Maintenance.find({ room: room._id })
            .populate("room")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: maintenances.length,
            maintenances
        });
    } catch (err) {
        console.error("Lỗi lấy lịch bảo trì theo phòng:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy lịch bảo trì",
            error: err.message
        });
    }
};

// Hoàn thành bảo trì
export const completeMaintenance = async (req, res) => {
    try {
        const { code } = req.params;

        const maintenance = await Maintenance.findOne({ maintenanceCode: code });

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy lịch bảo trì"
            });
        }

        if (maintenance.status === "Hoàn thành") {
            return res.status(400).json({
                success: false,
                message: "Lịch bảo trì đã được hoàn thành trước đó"
            });
        }

        // Cập nhật trạng thái bảo trì
        maintenance.status = "Hoàn thành";
        await maintenance.save();

        // Cập nhật trạng thái phòng về Trống
        const room = await Room.findById(maintenance.room);
        if (room) {
            room.status = RoomStatus.AVAILABLE;
            await room.save();
        }

        const populatedMaintenance = await Maintenance.findById(maintenance._id).populate("room");

        res.status(200).json({
            success: true,
            message: "Hoàn thành bảo trì thành công",
            maintenance: populatedMaintenance
        });
    } catch (err) {
        console.error("Lỗi hoàn thành bảo trì:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi hoàn thành bảo trì",
            error: err.message
        });
    }
};

// Cập nhật lịch bảo trì
export const updateMaintenance = async (req, res) => {
    try {
        const { code } = req.params;
        const { startDate, endDate, reason } = req.body;

        const maintenance = await Maintenance.findOne({ maintenanceCode: code });

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy lịch bảo trì"
            });
        }

        if (maintenance.status === "Hoàn thành") {
            return res.status(400).json({
                success: false,
                message: "Không thể cập nhật lịch bảo trì đã hoàn thành"
            });
        }

        // Cập nhật thông tin
        if (startDate) maintenance.startDate = startDate;
        if (endDate) maintenance.endDate = endDate;
        if (reason) maintenance.reason = reason;

        await maintenance.save();

        const populatedMaintenance = await Maintenance.findById(maintenance._id).populate("room");

        res.status(200).json({
            success: true,
            message: "Cập nhật lịch bảo trì thành công",
            maintenance: populatedMaintenance
        });
    } catch (err) {
        console.error("Lỗi cập nhật lịch bảo trì:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật lịch bảo trì",
            error: err.message
        });
    }
};

// Xóa lịch bảo trì
export const deleteMaintenance = async (req, res) => {
    try {
        const { code } = req.params;

        const maintenance = await Maintenance.findOne({ maintenanceCode: code });

        if (!maintenance) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy lịch bảo trì"
            });
        }

        // Nếu đang bảo trì, cập nhật trạng thái phòng về Trống
        if (maintenance.status === "Đang bảo trì") {
            const room = await Room.findById(maintenance.room);
            if (room) {
                room.status = RoomStatus.AVAILABLE;
                await room.save();
            }
        }

        await Maintenance.findByIdAndDelete(maintenance._id);

        res.status(200).json({
            success: true,
            message: "Xóa lịch bảo trì thành công"
        });
    } catch (err) {
        console.error("Lỗi xóa lịch bảo trì:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa lịch bảo trì",
            error: err.message
        });
    }
};
