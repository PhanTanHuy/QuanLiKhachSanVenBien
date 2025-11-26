import BookingDetail from '../models/BookingDetail.js';
import User from '../models/User.js';
import Rooms from '../models/Rooms.js';
import { PaymentMethod } from '../configs/enum/paymentEnum.js';

export default async function initBookings() {
    try {
        const count = await BookingDetail.countDocuments();
        if (count === 0) {
            // Fetch real users and rooms from database
            const users = await User.find().limit(5);
            const rooms = await Rooms.find().limit(5);

            if (users.length === 0 || rooms.length === 0) {
                console.warn("⚠️ Không đủ user hoặc room để tạo booking. Bỏ qua khởi tạo booking.");
                return;
            }

            // Create 10 mock bookings with real references
            const mockBookings = [];
            const bookingCodes = [
                "BK-20251126-0001", "BK-20251126-0002", "BK-20251126-0003",
                "BK-20251126-0004", "BK-20251126-0005", "BK-20251126-0006",
                "BK-20251126-0007", "BK-20251126-0008", "BK-20251126-0009",
                "BK-20251126-0010"
            ];

            const paymentMethods = [PaymentMethod.CASH, PaymentMethod.TRANSFER];

            for (let i = 0; i < 10; i++) {
                const user = users[i % users.length];
                const room = rooms[i % rooms.length];

                // Dates for different bookings
                const checkInDate = new Date(2025, 11, 1 + i * 2);
                const checkOutDate = new Date(2025, 11, 3 + i * 2);

                mockBookings.push({
                    bookingCode: bookingCodes[i],
                    user: user._id,
                    userSnapshot: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        cccd: user.cccd,
                        address: user.address
                    },
                    room: room._id,
                    roomSnapshot: {
                        code: room.roomCode || room._id.toString(),
                        type: room.type,
                        description: room.description,
                        pricePerNight: room.price
                    },
                    checkInDate,
                    checkOutDate,
                    pricePerNight: room.price,
                    paymentMethod: paymentMethods[i % paymentMethods.length]
                });
            }

            await BookingDetail.insertMany(mockBookings);
            console.log("✅ Đã khởi tạo dữ liệu chi tiết đặt phòng mẫu! (10 records)");
        }
    } catch (error) {
        console.error("Lỗi khi khởi tạo booking:", error);
    }
}

