Hướng dẫn tạo chi tiết đặt phòng:

import { createBookingApi } from "../../../api/bookingApi.js"; // có thể thay đổi đường dẫn

// Dữ liệu cần truyền
const bookingData = {
    userId: "675226b99a6b82df8cc24aa7",      // ID của user
    roomId: "675226b99a6b82df8cc24a8f",      // ID của phòng
    checkInDate: "2025-12-10",               // Ngày nhận phòng
    checkOutDate: "2025-12-15",              // Ngày trả phòng
    paymentMethod: "Tiền mặt",               // "Tiền mặt" hoặc "Chuyển khoản"
    status: "Chờ thanh toán"                 // Optional: "Chờ thanh toán" hoặc "Đã thanh toán"
};

// Gọi API
try {
    const token = localStorage.getItem("accessToken");
    const result = await createBookingApi(bookingData, token);
    console.log("Đặt phòng thành công:", result.booking);
    // result.booking chứa toàn bộ thông tin booking đã tạo
} catch (error) {
    console.error("Lỗi:", error.message);
}

