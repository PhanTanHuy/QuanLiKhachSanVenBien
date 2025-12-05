import BookingDetail from "../models/BookingDetail.js";
import { BookingStatus } from "../configs/enum/bookingStatusEnum.js";
// Lấy tất cả chi tiết đặt phòng (có populate user và room)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingDetail.find()
      .populate("user", "-hashedPassword")
      .populate("room")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Danh sách tất cả chi tiết đặt phòng",
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllBookings", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy chi tiết đặt phòng theo mã đặt phòng
export const getBookingByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const booking = await BookingDetail.findOne({ bookingCode: code })
      .populate("user", "-hashedPassword")
      .populate("room");

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết đặt phòng" });
    }

    return res.status(200).json({
      message: "Chi tiết đặt phòng",
      booking
    });
  } catch (error) {
    console.error("Lỗi khi gọi getBookingByCode", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// Tính tổng doanh thu (chỉ lấy các booking đã thanh toán)
export const getRevenue = async (req, res) => {
  try {
    const bookings = await BookingDetail.find({ status: BookingStatus.PAID });

    const totalRevenue = bookings.reduce((sum, item) => {
      return sum + (item.totalPrice || 0);
    }, 0);

    return res.status(200).json({
      message: "Tổng doanh thu từ các đơn đã thanh toán",
      totalBookings: bookings.length,
      totalRevenue: totalRevenue
    });

  } catch (error) {
    console.error("Lỗi khi tính doanh thu:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};