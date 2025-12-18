import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
    {
        maintenanceCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function(value) {
                    return value > this.startDate;
                },
                message: "Ngày kết thúc phải sau ngày bắt đầu"
            }
        },
        reason: {
            type: String,
            required: true,
            trim: true
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        // Lưu snapshot của phòng tại thời điểm bảo trì
        roomSnapshot: {
            roomCode: String,
            roomType: String,
            floor: Number
        },
        status: {
            type: String,
            enum: ["Đang bảo trì", "Hoàn thành"],
            default: "Đang bảo trì"
        }
    },
    {
        timestamps: true
    }
);

// Tự động tạo mã bảo trì theo format MT-YYYYMMDD-roomCode (VD: MT-20231216-101)
maintenanceSchema.pre("validate", async function(next) {
    if (this.isNew && !this.maintenanceCode) {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
        
        // Lấy mã phòng từ roomSnapshot
        const roomCode = this.roomSnapshot?.roomCode || "UNKNOWN";
        
        this.maintenanceCode = `MT-${dateStr}-${roomCode}`;
    }
    next();
});

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;
