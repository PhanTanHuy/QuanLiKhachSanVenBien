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
