import BookingDetail from "../models/BookingDetail.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import { BookingStatus } from "../configs/enum/bookingStatusEnum.js";

// Hàm tạo mã đặt phòng tự động (format: BK-YYYYMMDD-XXXX)
const generateBookingCode = async () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  
  // Đếm số booking trong ngày hôm nay
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));
  
  const count = await BookingDetail.countDocuments({
    createdAt: { $gte: todayStart, $lte: todayEnd }
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `BK-${dateStr}-${sequence}`;
};

// Tạo chi tiết đặt phòng mới
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      paymentMethod,
      status
    } = req.body;

    // Validate required fields
    if (!userId || !roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ 
        message: "Thiếu thông tin bắt buộc: userId, roomId, checkInDate, checkOutDate" 
      });
    }

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Kiểm tra phòng tồn tại
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut <= checkIn) {
      return res.status(400).json({ 
        message: "Ngày trả phòng phải sau ngày nhận phòng" 
      });
    }

    // Tạo mã đặt phòng tự động
    const bookingCode = await generateBookingCode();

    // Tạo booking mới
    const newBooking = new BookingDetail({
      bookingCode,
      user: userId,
      userSnapshot: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        cccd: user.cccd,
        address: user.address
      },
      room: roomId,
      roomSnapshot: {
        code: room.id,
        type: room.type,
        description: room.desc,
        pricePerNight: room.price
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      pricePerNight: room.price,
      paymentMethod: paymentMethod || "Tiền mặt",
      status: status || BookingStatus.PENDING
      // totalPrice, deposit, nights sẽ được tính tự động trong pre-validate hook
    });

    await newBooking.save();

    // Populate để trả về đầy đủ thông tin
    const savedBooking = await BookingDetail.findById(newBooking._id)
      .populate("user", "-hashedPassword")
      .populate("room");

    return res.status(201).json({
      message: "Đặt phòng thành công",
      booking: savedBooking
    });

  } catch (error) {
    console.error("Lỗi khi tạo booking:", error);
    return res.status(500).json({ 
      message: "Lỗi hệ thống", 
      error: error.message 
    });
  }
};

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