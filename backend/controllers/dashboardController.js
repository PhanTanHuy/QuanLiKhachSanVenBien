import Room from "../models/Room.js";
import BookingDetail from "../models/BookingDetail.js";
import User from "../models/User.js";
import { RoomStatus } from "../configs/enum/roomEnum.js";
import { BookingStatus } from "../configs/enum/bookingStatusEnum.js";

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
    const paidBookings = await BookingDetail.countDocuments({ status: BookingStatus.PAID });
    const pendingBookings = await BookingDetail.countDocuments({ status: BookingStatus.PENDING });
    
    // Tính tổng doanh thu (chỉ các booking đã thanh toán)
    const paidBookingsList = await BookingDetail.find({ status: BookingStatus.PAID });
    const totalRevenue = paidBookingsList.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
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
          paid: paidBookings,
          pending: pendingBookings
        },
        revenue: {
          total: totalRevenue,
          paidBookings: paidBookings
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