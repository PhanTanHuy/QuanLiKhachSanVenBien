import mongoose from 'mongoose';
import { PaymentMethod } from '../configs/enum/paymentEnum.js';
import { BookingStatus } from "../configs/enum/bookingStatusEnum.js";

// Chi tiết đặt phòng
const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true }, // Mã đặt phòng (ví dụ: BK-20251126-0001)

  // Thông tin user (tham chiếu + snapshot để lưu lịch sử)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userSnapshot: {
    userId: { type: String },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    cccd: { type: String },
    address: { type: String }
  },

  // Thông tin phòng (tham chiếu + snapshot để lưu giá tại thời điểm đặt)
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomSnapshot: {
    roomId: { type: String},
    code: { type: String },
    type: { type: String },
    description: { type: String },
    pricePerNight: { type: Number } // giá mỗi đêm (lưu lại để tính)
  },

  // Ngày nhận/trả phòng
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },

  // Số đêm (tính tự động)
  nights: { type: Number, default: 1 },

  // Giá phòng: tổng tiền = pricePerNight * nights
  pricePerNight: { type: Number, required: true },
  totalPrice: { type: Number, required: true },

  // Số tiền cọc (mặc định 30% của tổng tiền)
  deposit: { type: Number, required: true },

  // Phương thức thanh toán
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    default: PaymentMethod.CASH
  },

  // Trạng thái thanh toán / đặt (tuỳ ý có thể mở rộng sau)
  status: { 
    type: String, 
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING 
  }


}, { timestamps: true });

// Tính toán nights, totalPrice và deposit trước khi validate/save
bookingSchema.pre('validate', function (next) {
  try {
    // ensure dates
    if (!this.checkInDate || !this.checkOutDate) return next();

    const msPerDay = 1000 * 60 * 60 * 24;
    // calculate nights (at least 1)
    const diff = Math.ceil((this.checkOutDate - this.checkInDate) / msPerDay);
    this.nights = diff > 0 ? diff : 1;

    // pricePerNight should be present (snapshot or provided)
    if (!this.pricePerNight && this.roomSnapshot && this.roomSnapshot.pricePerNight) {
      this.pricePerNight = this.roomSnapshot.pricePerNight;
    }

    // compute total and deposit
    this.totalPrice = (this.pricePerNight || 0) * this.nights;
    // deposit = 30% rounded to nearest integer
    this.deposit = Math.round(this.totalPrice * 0.3);

    next();
  } catch (err) {
    next(err);
  }
});

const BookingDetail = mongoose.model('BookingDetail', bookingSchema);
export default BookingDetail;
