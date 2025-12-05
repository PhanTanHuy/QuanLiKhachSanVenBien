const API_URL = "/api/bookings";

// --- Tạo booking mới ---
export async function createBookingApi(bookingData, token) {
    try {
        const headers = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const res = await fetch(API_URL, {
            method: "POST",
            headers,
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
export async function getAllBookingsApi(token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(API_URL, { headers });
        if (!res.ok) throw new Error("Lấy danh sách booking thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { bookings: [] };
    }
}

// --- Lấy booking theo mã ---
export async function getBookingByCodeApi(code, token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/${code}`, { headers });
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

// --- Lay danhh thu---
export async function getRevenue(token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/revenue`, { headers });
        if (!res.ok) throw new Error("Lấy danh thu thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}
