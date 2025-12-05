import { Notify } from "../../../components/notification.js";
import { getDashboardStatsApi } from "../../../api/dashboardApi.js";

// --- Format tiền VND ---
function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

// --- Format số ---
function formatNumber(value) {
    return new Intl.NumberFormat("vi-VN").format(value);
}

// --- Tải thống kê từ API ---
async function loadDashboardStats() {
    try {
        const token = localStorage.getItem("accessToken");
        const data = await getDashboardStatsApi(token);
        
        if (!data || !data.stats) {
            Notify.show("Không thể tải thống kê dashboard", "error");
            return;
        }
        
        const { stats } = data;
        
        // Cập nhật thống kê phòng
        document.getElementById('totalRooms').textContent = formatNumber(stats.rooms.total);
        document.getElementById('availableRooms').textContent = formatNumber(stats.rooms.available);
        document.getElementById('reservedRooms').textContent = formatNumber(stats.rooms.reserved);
        document.getElementById('occupiedRooms').textContent = formatNumber(stats.rooms.occupied);
        document.getElementById('maintenanceRooms').textContent = formatNumber(stats.rooms.maintenance);
        
        // Cập nhật thống kê doanh thu
        document.getElementById('totalRevenue').textContent = formatCurrency(stats.revenue.total);
        document.getElementById('paidBookingsCount').textContent = formatNumber(stats.revenue.paidBookings);
        
        // Cập nhật thống kê booking
        document.getElementById('totalBookings').textContent = formatNumber(stats.bookings.total);
        document.getElementById('paidBookings').textContent = formatNumber(stats.bookings.paid);
        document.getElementById('pendingBookings').textContent = formatNumber(stats.bookings.pending);
        
        // Cập nhật thống kê users
        document.getElementById('totalUsers').textContent = formatNumber(stats.users.total);
        
        console.log("✅ Thống kê dashboard đã được tải");
    } catch (err) {
        console.error("Lỗi khi tải thống kê:", err);
        Notify.show("Lỗi khi tải thống kê dashboard", "error");
    }
}

// --- Khởi tạo dashboard ---
async function init() {
    await loadDashboardStats();
}

// Chạy khi trang load xong
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}