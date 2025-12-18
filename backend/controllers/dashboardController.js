import Room from "../models/Room.js";
import BookingDetail from "../models/BookingDetail.js";
import User from "../models/User.js";
import { RoomStatus } from "../configs/enum/roomEnum.js";

// Lấy thống kê tổng quan cho dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Đếm tổng số phòng
    const totalRooms = await Room.countDocuments();
    
    // Đếm số phòng theo trạng thái
    const availableRooms = await Room.countDocuments({ status: RoomStatus.AVAILABLE });
    const occupiedRooms = await Room.countDocuments({ status: RoomStatus.OCCUPIED });
    const reservedRooms = await Room.countDocuments({ status: RoomStatus.RESERVED });
    const maintenanceRooms = await Room.countDocuments({ status: RoomStatus.MAINTENANCE });
    
    // Đếm tổng số booking
    const totalBookings = await BookingDetail.countDocuments();
    const occupiedBookings = await BookingDetail.countDocuments({ status: RoomStatus.OCCUPIED });
    const reservedBookings = await BookingDetail.countDocuments({ status: RoomStatus.RESERVED });
    
    // Tính tổng doanh thu (chỉ các booking đang thuê)
    const occupiedBookingsList = await BookingDetail.find({ status: RoomStatus.OCCUPIED });
    const totalRevenue = occupiedBookingsList.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    // Đếm tổng số user
    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      message: "Thống kê dashboard",
      stats: {
        rooms: {
          total: totalRooms,
          available: availableRooms,
          occupied: occupiedRooms,
          reserved: reservedRooms,
          maintenance: maintenanceRooms
        },
        bookings: {
          total: totalBookings,
          occupied: occupiedBookings,
          reserved: reservedBookings
        },
        revenue: {
          total: totalRevenue,
          occupiedBookings: occupiedBookings
        },
        users: {
          total: totalUsers
        }
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê dashboard:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};