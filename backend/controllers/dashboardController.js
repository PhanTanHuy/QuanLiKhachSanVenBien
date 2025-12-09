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

// Lấy dữ liệu biểu đồ doanh thu theo tháng
export const getRevenueChart = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    // Tạo mảng 12 tháng
    const monthlyRevenue = Array(12).fill(0);
    const monthlyBookings = Array(12).fill(0);
    
    // Lấy tất cả booking đã thanh toán trong năm
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
    
    const bookings = await BookingDetail.find({
      status: BookingStatus.PAID,
      createdAt: { $gte: startOfYear, $lte: endOfYear }
    });
    
    // Tính doanh thu và số booking theo tháng
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).getMonth();
      monthlyRevenue[month] += booking.totalPrice || 0;
      monthlyBookings[month] += 1;
    });
    
    return res.status(200).json({
      message: "Dữ liệu biểu đồ doanh thu",
      year: currentYear,
      monthlyRevenue,
      monthlyBookings,
      labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
               "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy dữ liệu biểu đồ lượt đặt phòng theo tháng
export const getBookingChart = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    // Tạo mảng 12 tháng
    const monthlyBookings = Array(12).fill(0);
    
    // Lấy tất cả booking trong năm
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
    
    const bookings = await BookingDetail.find({
      createdAt: { $gte: startOfYear, $lte: endOfYear }
    });
    
    // Đếm số booking theo tháng
    bookings.forEach(booking => {
      const month = new Date(booking.createdAt).getMonth();
      monthlyBookings[month] += 1;
    });
    
    return res.status(200).json({
      message: "Dữ liệu biểu đồ lượt đặt phòng",
      year: currentYear,
      monthlyBookings,
      labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
               "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu biểu đồ booking:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
