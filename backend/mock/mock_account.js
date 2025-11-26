import { UserRole } from "../configs/enum/userEnum.js";

// Dữ liệu giả lập tài khoản, sau này sẽ lấy từ database
export const accounts = [
    {
        name: "Nguyễn Văn A",
        cccd: "001234567890",
        phone: "0912345678",
        address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
        email: "nguyenvana@example.com",
        password: "password123", // Hash trong thực tế
        role: UserRole.RECEPTIONIST
    },
    {
        name: "Phan Tan Huy",
        cccd: "001234567890",
        phone: "0912345678",
        address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
        email: "123@gmail.com",
        password: "11111111", // Hash trong thực tế
        role: UserRole.ADMIN
    },
    {
        name: "Trần Thị B",
        cccd: "001234567891",
        phone: "0987654321",
        address: "456 Đường Lê Lợi, Quận 3, TP.HCM",
        email: "tranthib@example.com",
        password: "password456", // Hash trong thực tế
        role: UserRole.RECEPTIONIST
    },
    {
        name: "Phạm Văn C",
        cccd: "001234567892",
        phone: "0978123456",
        address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
        email: "phamvanc@example.com",
        password: "password789", // Hash trong thực tế
        role: UserRole.USER
    },
    {
        name: "Lê Thị D",
        cccd: "001234567893",
        phone: "0965432109",
        address: "321 Đường Ngô Văn Năm, Bình Thạnh, TP.HCM",
        email: "leithid@example.com",
        password: "password012", // Hash trong thực tế
        role: UserRole.USER
    },
    {
        name: "Võ Văn E",
        cccd: "001234567894",
        phone: "0912876543",
        address: "654 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM",
        email: "vovane@example.com",
        password: "password345", // Hash trong thực tế
        role: UserRole.RECEPTIONIST
    }
];
