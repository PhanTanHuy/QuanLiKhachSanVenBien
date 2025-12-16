import BookingDetail from '../models/BookingDetail.js';
import User from '../models/User.js';
import Rooms from '../models/Room.js';
import { PaymentMethod } from './enum/paymentEnum.js';
import { BookingStatus } from './enum/bookingStatusEnum.js';

export default async function initBookings() {
    try {
        const count = await BookingDetail.countDocuments();
        if (count === 0) {
            // Fetch real users and rooms from database
            const users = await User.find().limit(6);
            const rooms = await Rooms.find().limit(10);

            if (users.length === 0 || rooms.length === 0) {
                console.warn("⚠️ Không đủ user hoặc room để tạo booking. Bỏ qua khởi tạo booking.");
                return;
            }

            // Create 10 mock bookings with real references
            const mockBookings = [];
            const bookingCodes = [
                "BK-20251216-0001", "BK-20251216-0002", "BK-20251216-0003",
                "BK-20251216-0004", "BK-20251216-0005", "BK-20251216-0006",
                "BK-20251216-0007", "BK-20251216-0008", "BK-20251216-0009",
                "BK-20251216-0010"
            ];

            const paymentMethods = [PaymentMethod.CASH, PaymentMethod.TRANSFER];
            const statuses = [BookingStatus.PENDING, BookingStatus.PAID];

            for (let i = 0; i < 10; i++) {
                const user = users[i % users.length];
                const room = rooms[i % rooms.length];

                // Dates for different bookings
                const checkInDate = new Date(2025, 11, 20 + i * 2); // Bắt đầu từ 20/12/2025
                const checkOutDate = new Date(2025, 11, 22 + i * 2);

                mockBookings.push({
                    bookingCode: bookingCodes[i],
                    user: user._id,
                    userSnapshot: {
                        userId: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        cccd: user.cccd,
                        address: user.address
                    },
                    room: room._id,
                    roomSnapshot: {
                        roomId: room._id.toString(),
                        code: room.id,
                        type: room.type,
                        description: room.desc,
                        pricePerNight: room.price
                    },
                    checkInDate,
                    checkOutDate,
                    pricePerNight: room.price,
                    paymentMethod: paymentMethods[i % paymentMethods.length],
                    status: statuses[i % statuses.length]
                });
            }

            await BookingDetail.insertMany(mockBookings);
            console.log("✅ Đã khởi tạo dữ liệu chi tiết đặt phòng mẫu! (10 records)");
        }
    } catch (error) {
        console.error("Lỗi khi khởi tạo booking:", error);
    }
}

