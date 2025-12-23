const API_URL = "/api/bookings";

// --- Tạo booking mới ---
export async function createBookingApi(bookingData) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Đặt phòng thất bại");
        }
        
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Lấy tất cả booking ---
export async function getAllBookingsApi() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Lấy danh sách booking thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { bookings: [] };
    }
}

// --- Lấy booking theo mã ---
export async function getBookingByCodeApi(code) {
    try {
        const res = await fetch(`${API_URL}/${code}`);
        if (!res.ok) throw new Error("Lấy booking thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Lấy enum phương thức thanh toán ---
export async function getPaymentMethodsApi() {
    try {
        const res = await fetch(`${API_URL}/enum/payment-methods`);
        if (!res.ok) throw new Error("Lấy enum phương thức thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { paymentMethods: {} };
    }
}

// --- Lấy enum trạng thái đặt phòng ---
export async function getBookingStatusesApi() {
    try {
        const res = await fetch(`${API_URL}/enum/booking-statuses`);
        if (!res.ok) throw new Error("Lấy enum trạng thái thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { bookingStatuses: {} };
    }
}

// --- Lấy danh sách booking theo phòng (roomId hoặc room code) ---
export async function getBookingsByRoomApi(roomIdentifier) {
    try {
        const res = await fetch(`${API_URL}/by-room/${roomIdentifier}`);
        if (!res.ok) throw new Error("Lấy booking theo phòng thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Lấy danh sách booking theo user (userId hoặc email) ---
export async function getBookingsByUserApi(userIdentifier) {
    try {
        const res = await fetch(`${API_URL}/by-user/${userIdentifier}`);
        if (!res.ok) throw new Error("Lấy booking theo user thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Lấy danh sách booking của user hiện tại ---
export async function getMyBookingsApi() {
    try {
        // Bước 1: Lấy accessToken từ localStorage
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            throw new Error("Vui lòng đăng nhập để xem lịch sử đặt phòng");
        }

        // Bước 2: Lấy thông tin user hiện tại
        const meRes = await fetch("/api/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!meRes.ok) {
            throw new Error("Không thể lấy thông tin người dùng");
        }

        const meData = await meRes.json();
        const userEmail = meData.user.email;

        // Bước 3: Lấy danh sách booking của user đó
        const bookingsRes = await fetch(`${API_URL}/by-user/${userEmail}`);
        
        if (!bookingsRes.ok) {
            throw new Error("Lấy danh sách booking thất bại");
        }

        return await bookingsRes.json();
    } catch (err) {
        console.error("Lỗi khi lấy booking của user:", err);
        throw err;
    }
}

// --- Lay danhh thu---
export async function getRevenue() {
    try {
        const res = await fetch(`${API_URL}/revenue`);
        if (!res.ok) throw new Error("Lấy danh thu thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}
