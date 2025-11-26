const API_URL = "/api/bookings";

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
