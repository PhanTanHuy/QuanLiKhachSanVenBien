import BookingDetail from "../models/BookingDetail.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import { RoomStatus } from "../configs/enum/roomEnum.js";
import { BookingStatus } from "../configs/enum/bookingStatusEnum.js";

// Hàm tạo mã đặt phòng tự động (format: BK-YYYYMMDD-XXXX)
const generateBookingCode = async () => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD

  // Đếm số booking trong ngày hôm nay
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  const count = await BookingDetail.countDocuments({
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  const sequence = String(count + 1).padStart(4, "0");
  return `BK-${dateStr}-${sequence}`;
};

// Tạo chi tiết đặt phòng mới
export const createBooking = async (req, res) => {
  try {
    console.log("Đang tiến hành create-booking");

    let userId;
    const {
      email,
      name,
      phone,
      cccd,
      address,
      roomId,
      checkInDate,
      checkOutDate,
      paymentMethod,
      status,
      deposit,
      accountType, // giúp be biết cần tạo user hay dùng user hiện có
    } = req.body;

    // Xử lý thông tin user
    if (accountType === "new") {
      // Tạo user mới
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          message:
            "Email đã tồn tại, vui lòng sử dụng email khác hoặc chọn tài khoản hiện có",
        });
      }
      const user = new User({
        // Tạo user mới với thông tin từ form
        hashedPassword: "1", // Đặt mật khẩu rỗng, có thể yêu cầu đổi mật khẩu sau
        email,
        name,
        phone,
        cccd,
        address,
      });
      await user.save();
      userId = user._id;
    } else if (accountType === "old") {
      // Tìm user hiện có theo email
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tài khoản với email đã cho" });
      }
      userId = existingUser._id;
    } else {
      return res.status(400).json({ message: "Loại tài khoản không hợp lệ" });
    }
    console.log("📌 Tìm thấy userId:", userId);
    // Xử lý thông tin phòng
    const room = await Room.findOne({ id: roomId });

    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    // Tạo mã đặt phòng tự động
    const bookingCode = await generateBookingCode();

    // Tạo booking mới
    const newBooking = new BookingDetail({
      bookingCode,
      user: userId,
      userSnapshot: {
        name: name,
        email: email,
        phone: phone,
        cccd: cccd,
        address: address,
      },
      room: room._id,
      roomSnapshot: {
        code: room.id,
        type: room.type,
        description: room.desc,
        pricePerNight: room.price,
      },
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      pricePerNight: room.price,
      paymentMethod: paymentMethod,
      status: status,
      //deposit: deposit,
      // totalPrice, deposit, nights sẽ được tính tự động trong pre-validate hook
    });

    await newBooking.save();

    // Populate để trả về đầy đủ thông tin
    const savedBooking = await BookingDetail.findById(newBooking._id)
      .populate("user", "-hashedPassword")
      .populate("room");

    // Cập nhật trạng thái phòng
    const roomStatus = status === "Đang thuê" ? RoomStatus.OCCUPIED : RoomStatus.RESERVED;
    await Room.findByIdAndUpdate(room._id, { status: roomStatus });

    console.log("✅ Booking đã được tạo thành công");

    return res.status(201).json({
      success: true,
      message: "Đặt phòng thành công",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Lỗi khi tạo booking:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};


// Cập nhật chi tiết đặt phòng
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log("Update booking ID:", bookingId);
    
    const { status } = req.body;
    console.log("Update status:", status);
    if (!status) {
      return res.status(400).json({
        message: "Thiếu trạng thái booking",
      });
    }

    // Find by bookingCode (case insensitive)
    const updatedBooking = await BookingDetail.findOneAndUpdate(
      { bookingCode: new RegExp(`^${bookingId}$`, 'i') },
      { status },
      { new: true }
    )
      .populate("user", "-hashedPassword")
      .populate("room");

    console.log("Find by bookingCode result:", updatedBooking ? updatedBooking.bookingCode : "null");

    if (!updatedBooking) {
      console.log("Booking not found for update");
      // Log all booking codes for debug
      const allBookings = await BookingDetail.find({}, 'bookingCode');
      console.log("All booking codes in DB:", allBookings.map(b => b.bookingCode));
      return res.status(404).json({
        message: "Không tìm thấy chi tiết đặt phòng để cập nhật",
      });
    }

    return res.status(200).json({
      message: "Cập nhật booking thành công",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật booking:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

// Tạo chi tiết đặt phòng cho user 
export const createBookingByUser = async (req, res) => {
  try {
    const user = req.user;
    const { roomId, checkInDate, checkOutDate, paymentMethod } = req.body;

    console.log("📌 createBookingByUser called with:", { roomId, checkInDate, checkOutDate, paymentMethod });
    console.log("📌 User:", user._id);

    /* 1. Validate */
    if (!roomId || !checkInDate || !checkOutDate) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    /* 2. Tìm phòng */
    const room = await Room.findById(roomId);
    console.log("📌 Room found:", room ? room.id : "null");
    if (!room) {
      console.log("❌ Room not found");
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng",
      });
    }

    /* 3. Validate ngày */
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    console.log("📌 Dates parsed:", { checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString() });

    if (isNaN(checkIn) || isNaN(checkOut) || checkOut <= checkIn) {
      console.log("❌ Invalid dates");
      return res.status(400).json({
        success: false,
        message: "Ngày không hợp lệ",
      });
    }

    /* 4. Check trùng lịch */
    const conflict = await BookingDetail.findOne({
      room: room._id,
      status: { $in: [BookingStatus.RESERVED, BookingStatus.OCCUPIED] },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });
    console.log("📌 Conflict check:", conflict ? "conflict found" : "no conflict");

    if (conflict) {
      console.log("❌ Booking conflict");
      return res.status(409).json({
        success: false,
        message: "Phòng đã được đặt trong thời gian này",
      });
    }

    /* 5. Tạo booking */
    const bookingCode = await generateBookingCode();

    // Tính toán số đêm, tổng tiền, cọc
    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOut - checkIn) / msPerDay);
    const totalPrice = room.price * nights;
    const deposit = Math.round(totalPrice * 0.3);

    console.log("📌 Calculated values:", { nights, totalPrice, deposit });

    const booking = await BookingDetail.create({
      bookingCode,
      user: user._id,
      userSnapshot: {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      room: room._id,
      roomSnapshot: {
        roomId: room._id,
        code: room.code || room.id,
        type: room.type,
        description: room.desc,
        pricePerNight: room.price,
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      pricePerNight: room.price,
      totalPrice,
      deposit,
      paymentMethod,
      status: BookingStatus.RESERVED,
    });

    console.log("📌 Booking created:", booking._id);

    // Cập nhật trạng thái phòng thành RESERVED
    await Room.findByIdAndUpdate(room._id, { status: RoomStatus.RESERVED });
    console.log("📌 Room status updated");

    return res.status(201).json({
      success: true,
      message: "Đặt phòng thành công",
      booking,
    });
  } catch (err) {
    console.error("❌ createBooking error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

// GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const bookings = await BookingDetail.find(filter)
      .populate("room")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (err) {
    console.error("getMyBookings error", err);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};
//huy dat phong
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookingCode } = req.params;

    const booking = await BookingDetail.findOne({ bookingCode });
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Không có quyền hủy booking này" });
    }

    if (booking.status !== BookingStatus.RESERVED) {
      return res.status(400).json({
        message: "Chỉ được hủy khi chưa check-in",
      });
    }

    booking.status = BookingStatus.CANCELLED;
    await booking.save();

    // Cập nhật trạng thái phòng về available
    await Room.findByIdAndUpdate(booking.room, { status: RoomStatus.AVAILABLE });

    return res.json({
      success: true,
      message: "Hủy đặt phòng thành công",
    });
  } catch (err) {
    console.error("cancelBooking error", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
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
      bookings,
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
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết đặt phòng" });
    }

    return res.status(200).json({
      message: "Chi tiết đặt phòng",
      booking,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getBookingByCode", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// Lấy booking theo roomId hoặc room code
export const getBookingsByRoom = async (req, res) => {
  try {
    const { roomIdentifier } = req.params; // có thể là roomId (ObjectId) hoặc room code (string)

    // Tìm room trước để lấy được _id
    let room;
    
    // Thử tìm theo room code (id field)
    room = await Room.findOne({ id: roomIdentifier });
    
    // Nếu không tìm thấy, thử tìm theo MongoDB _id
    if (!room) {
      room = await Room.findById(roomIdentifier).catch(() => null);
    }

    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    // Tìm tất cả booking của phòng này
    const bookings = await BookingDetail.find({ room: room._id })
      .populate("user", "-hashedPassword")
      .populate("room")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Danh sách booking của phòng ${room.id}`,
      count: bookings.length,
      room: {
        _id: room._id,
        code: room.id,
        type: room.type
      },
      bookings
    });
  } catch (error) {
    console.error("Lỗi khi lấy booking theo phòng:", error);
    return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

// Lấy danh sách booking theo userId hoặc email
export const getBookingsByUser = async (req, res) => {
  try {
    const { userIdentifier } = req.params; // có thể là userId (ObjectId) hoặc email

    let user;

    // Kiểm tra xem userIdentifier có phải là email không (có chứa @)
    if (userIdentifier.includes("@")) {
      // Tìm theo email
      user = await User.findOne({ email: userIdentifier });
    } else {
      // Tìm theo MongoDB _id
      user = await User.findById(userIdentifier).catch(() => null);
    }

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Tìm tất cả booking của user này
    const bookings = await BookingDetail.find({ user: user._id })
      .populate("user", "-hashedPassword")
      .populate("room")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Danh sách booking của user ${user.name}`,
      count: bookings.length,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      bookings
    });
  } catch (error) {
    console.error("Lỗi khi lấy booking theo user:", error);
    return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
};

// Tính tổng doanh thu (chỉ lấy các booking đang thuê)
export const getRevenue = async (req, res) => {
  try {
    const bookings = await BookingDetail.find({ status: RoomStatus.OCCUPIED });

    const totalRevenue = bookings.reduce((sum, item) => {
      return sum + (item.totalPrice || 0);
    }, 0);

    return res.status(200).json({
      message: "Tổng doanh thu từ các phòng đang thuê",
      totalBookings: bookings.length,
      totalRevenue: totalRevenue,
    });
  } catch (error) {
    console.error("Lỗi khi tính doanh thu:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
