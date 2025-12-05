const API_URL = "/api/dashboard";

// --- Lấy thống kê tổng quan ---
export async function getDashboardStatsApi(token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/stats`, { headers });
        if (!res.ok) throw new Error("Lấy thống kê dashboard thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

// --- Lấy dữ liệu biểu đồ doanh thu ---
export async function getRevenueChartApi(year, token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = year ? `${API_URL}/revenue-chart?year=${year}` : `${API_URL}/revenue-chart`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("Lấy dữ liệu biểu đồ doanh thu thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

// --- Lấy dữ liệu biểu đồ lượt đặt phòng ---
export async function getBookingChartApi(year, token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const url = year ? `${API_URL}/booking-chart?year=${year}` : `${API_URL}/booking-chart`;
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("Lấy dữ liệu biểu đồ booking thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}
