import { PaymentMethod } from "../configs/enum/paymentEnum.js";
import { BookingStatus } from "../configs/enum/bookingStatusEnum.js";

// Dữ liệu giả lập chi tiết đặt phòng (10 records)
export const mockBookings = [
    {
        bookingCode: "BK-20251126-0001",
        userSnapshot: {
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0912345678",
            cccd: "001234567890",
            address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
        },
        roomSnapshot: {
            code: "P-101",
            type: "Single",
            description: "Phòng đơn thoáng mát",
            pricePerNight: 500000
        },
        checkInDate: new Date("2025-12-01T14:00:00Z"),
        checkOutDate: new Date("2025-12-03T12:00:00Z"),
        pricePerNight: 500000,
        paymentMethod: PaymentMethod.CASH,
        status: BookingStatus.PENDING
    },
    {
        bookingCode: "BK-20251126-0002",
        userSnapshot: {
            name: "Trần Thị B",
            email: "tranthib@example.com",
            phone: "0987654321",
            cccd: "001234567891",
            address: "456 Đường Lê Lợi, Quận 3, TP.HCM"
        },
        roomSnapshot: {
            code: "P-102",
            type: "Double",
            description: "Phòng đôi sang trọng",
            pricePerNight: 750000
        },
        checkInDate: new Date("2025-12-05T14:00:00Z"),
        checkOutDate: new Date("2025-12-08T12:00:00Z"),
        pricePerNight: 750000,
        paymentMethod: PaymentMethod.TRANSFER,
        status: BookingStatus.PAID
    },
    {
        bookingCode: "BK-20251126-0003",
        userSnapshot: {
            name: "Phạm Văn C",
            email: "phamvanc@example.com",
            phone: "0978123456",
            cccd: "001234567892",
            address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM"
        },
        roomSnapshot: {
            code: "P-103",
            type: "Suite",
            description: "Phòng suite hạng sang",
            pricePerNight: 1500000
        },
        checkInDate: new Date("2025-12-10T14:00:00Z"),
        checkOutDate: new Date("2025-12-15T12:00:00Z"),
        pricePerNight: 1500000,
        paymentMethod: PaymentMethod.CASH,
        status: BookingStatus.PENDING
    },
    {
        bookingCode: "BK-20251126-0004",
        userSnapshot: {
            name: "Lê Thị D",
            email: "leithid@example.com",
            phone: "0965432109",
            cccd: "001234567893",
            address: "321 Đường Ngô Văn Năm, Bình Thạnh, TP.HCM"
        },
        roomSnapshot: {
            code: "P-201",
            type: "Single",
            description: "Phòng đơn thoáng mát",
            pricePerNight: 500000
        },
        checkInDate: new Date("2025-12-16T14:00:00Z"),
        checkOutDate: new Date("2025-12-18T12:00:00Z"),
        pricePerNight: 500000,
        paymentMethod: PaymentMethod.TRANSFER,
        status: BookingStatus.PAID
    },
    {
        bookingCode: "BK-20251126-0005",
        userSnapshot: {
            name: "Võ Văn E",
            email: "vovane@example.com",
            phone: "0912876543",
            cccd: "001234567894",
            address: "654 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM"
        },
        roomSnapshot: {
            code: "P-202",
            type: "Double",
            description: "Phòng đôi sang trọng",
            pricePerNight: 750000
        },
        checkInDate: new Date("2025-12-20T14:00:00Z"),
        checkOutDate: new Date("2025-12-24T12:00:00Z"),
        pricePerNight: 750000,
        paymentMethod: PaymentMethod.CASH,
        status: BookingStatus.PENDING
    },
    {
        bookingCode: "BK-20251126-0006",
        userSnapshot: {
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0912345678",
            cccd: "001234567890",
            address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
        },
        roomSnapshot: {
            code: "P-203",
            type: "Suite",
            description: "Phòng suite hạng sang",
            pricePerNight: 1500000
        },
        checkInDate: new Date("2025-12-25T14:00:00Z"),
        checkOutDate: new Date("2025-12-27T12:00:00Z"),
        pricePerNight: 1500000,
        paymentMethod: PaymentMethod.TRANSFER,
        status: BookingStatus.PAID
    },
    {
        bookingCode: "BK-20251126-0007",
        userSnapshot: {
            name: "Trần Thị B",
            email: "tranthib@example.com",
            phone: "0987654321",
            cccd: "001234567891",
            address: "456 Đường Lê Lợi, Quận 3, TP.HCM"
        },
        roomSnapshot: {
            code: "P-301",
            type: "Single",
            description: "Phòng đơn thoáng mát",
            pricePerNight: 500000
        },
        checkInDate: new Date("2025-12-28T14:00:00Z"),
        checkOutDate: new Date("2025-12-30T12:00:00Z"),
        pricePerNight: 500000,
        paymentMethod: PaymentMethod.CASH,
        status: BookingStatus.PENDING
    },
    {
        bookingCode: "BK-20251126-0008",
        userSnapshot: {
            name: "Phạm Văn C",
            email: "phamvanc@example.com",
            phone: "0978123456",
            cccd: "001234567892",
            address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM"
        },
        roomSnapshot: {
            code: "P-302",
            type: "Double",
            description: "Phòng đôi sang trọng",
            pricePerNight: 750000
        },
        checkInDate: new Date("2026-01-02T14:00:00Z"),
        checkOutDate: new Date("2026-01-05T12:00:00Z"),
        pricePerNight: 750000,
        paymentMethod: PaymentMethod.TRANSFER,
        status: BookingStatus.PAID
    },
    {
        bookingCode: "BK-20251126-0009",
        userSnapshot: {
            name: "Lê Thị D",
            email: "leithid@example.com",
            phone: "0965432109",
            cccd: "001234567893",
            address: "321 Đường Ngô Văn Năm, Bình Thạnh, TP.HCM"
        },
        roomSnapshot: {
            code: "P-303",
            type: "Suite",
            description: "Phòng suite hạng sang",
            pricePerNight: 1500000
        },
        checkInDate: new Date("2026-01-06T14:00:00Z"),
        checkOutDate: new Date("2026-01-10T12:00:00Z"),
        pricePerNight: 1500000,
        paymentMethod: PaymentMethod.CASH,
        status: BookingStatus.PENDING
    },
    {
        bookingCode: "BK-20251126-0010",
        userSnapshot: {
            name: "Võ Văn E",
            email: "vovane@example.com",
            phone: "0912876543",
            cccd: "001234567894",
            address: "654 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM"
        },
        roomSnapshot: {
            code: "P-401",
            type: "Single",
            description: "Phòng đơn thoáng mát",
            pricePerNight: 500000
        },
        checkInDate: new Date("2026-01-12T14:00:00Z"),
        checkOutDate: new Date("2026-01-15T12:00:00Z"),
        pricePerNight: 500000,
        paymentMethod: PaymentMethod.TRANSFER,
        status: BookingStatus.PAID
    }
];
