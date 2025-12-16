import { Notify } from "../../../components/notification.js";
import { getAllBookingsApi, getBookingByCodeApi, getPaymentMethodsApi, getBookingStatusesApi } from "../../../api/bookingApi.js";

let bookingsData = [];
let paymentMethods = {};
let bookingStatuses = {};

// --- DOM ELEMENTS ---
const bookingList = document.getElementById("bookingList");
const detailPopup = document.getElementById("detailPopup");
detailPopup.style.display = "none";
document.getElementById("closeDetail").onclick = () => detailPopup.style.display = "none";

// --- UTILS ---
function formatDate(date) {
    return new Date(date).toLocaleString("vi-VN");
}

function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function renderBookings(list) {
    bookingList.innerHTML = "";
    list.forEach(booking => {
        const card = document.createElement("div");
        card.className = "booking-card";
        const statusColor = booking.status === 'Đã thanh toán' ? '#4CAF50' : '#FF9800';
        const paymentColor = booking.paymentMethod === 'Tiền mặt' ? '#4CAF50' : '#2196F3';
        card.innerHTML = `
            <div class="booking-card-header">
                <h3>${booking.bookingCode}</h3>
                <div>
                    <span class="payment-badge" style="background-color: ${paymentColor}">${booking.paymentMethod}</span>
                    <span class="status-badge" style="background-color: ${statusColor}">${booking.status}</span>
                </div>
            </div>
            <div class="booking-card-info">
                <p><strong>Khách:</strong> ${booking.userSnapshot?.name || "N/A"}</p>
                <p><strong>Phòng:</strong> ${booking.roomSnapshot?.code || "N/A"} (${booking.roomSnapshot?.type || "N/A"})</p>
                <p><strong>Ngày nhận:</strong> ${formatDate(booking.checkInDate)}</p>
                <p><strong>Ngày trả:</strong> ${formatDate(booking.checkOutDate)}</p>
                <p><strong>Tổng tiền:</strong> <span style="color: #ff914d; font-weight: bold;">${formatCurrency(booking.totalPrice)}</span></p>
                <p><strong>Cọc:</strong> ${formatCurrency(booking.deposit)} | <strong>Phương thức:</strong> ${booking.paymentMethod}</p>
            </div>
        `;
        card.onclick = () => openDetailPopup(booking);
        bookingList.appendChild(card);
    });
}

function openDetailPopup(booking) {
    document.getElementById("detailCode").value = booking.bookingCode;
    document.getElementById("detailUserName").value = booking.userSnapshot?.name || "";
    document.getElementById("detailUserEmail").value = booking.userSnapshot?.email || "";
    document.getElementById("detailUserPhone").value = booking.userSnapshot?.phone || "";
    document.getElementById("detailUserCccd").value = booking.userSnapshot?.cccd || "";
    document.getElementById("detailUserAddress").value = booking.userSnapshot?.address || "";

    document.getElementById("detailRoomCode").value = booking.roomSnapshot?.code || "";
    document.getElementById("detailRoomType").value = booking.roomSnapshot?.type || "";
    document.getElementById("detailRoomDesc").value = booking.roomSnapshot?.description || "";

    document.getElementById("detailCheckIn").value = formatDate(booking.checkInDate);
    document.getElementById("detailCheckOut").value = formatDate(booking.checkOutDate);
    document.getElementById("detailNights").value = booking.nights;
    document.getElementById("detailPrice").value = booking.pricePerNight;
    document.getElementById("detailTotal").value = booking.totalPrice;
    document.getElementById("detailDeposit").value = booking.deposit;
    document.getElementById("detailPayment").value = booking.paymentMethod;
    document.getElementById("detailStatus").value = booking.status;

    detailPopup.style.display = "flex";
}

// --- FETCH BOOKINGS ---
async function fetchBookings() {
    try {
        const token = localStorage.getItem("accessToken");
        const data = await getAllBookingsApi(token);
        bookingsData = data.bookings || [];
        renderBookings(bookingsData);
    } catch (err) {
        console.error("Lỗi khi fetch bookings:", err);
        Notify.show("Lỗi khi tải danh sách booking", "error");
    }
}

// --- SEARCH & FILTER ---
function filterBookings() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const paymentFilter = document.getElementById("paymentFilter").value;
    const statusFilter = document.getElementById("statusFilter").value;

    const filtered = bookingsData.filter(b => {
        const matchSearch = 
            b.bookingCode.toLowerCase().includes(searchText) ||
            b.userSnapshot?.name?.toLowerCase().includes(searchText) ||
            b.userSnapshot?.phone?.includes(searchText) ||
            b.roomSnapshot?.code?.toLowerCase().includes(searchText);
        
        const matchPayment = !paymentFilter || b.paymentMethod === paymentFilter;
        const matchStatus = !statusFilter || b.status === statusFilter;
        
        return matchSearch && matchPayment && matchStatus;
    });

    renderBookings(filtered);
}

document.getElementById("searchInput").oninput = () => filterBookings();
document.getElementById("paymentFilter").onchange = () => filterBookings();
document.getElementById("statusFilter").onchange = () => filterBookings();

// --- SORTING BY DATE ---
let sortDateAsc = true;
const sortByDateBtn = document.getElementById("sortByDateBtn");
sortByDateBtn.onclick = () => {
    sortDateAsc = !sortDateAsc;
    const sorted = [...bookingsData].sort((a, b) => {
        const dateA = new Date(a.checkInDate);
        const dateB = new Date(b.checkInDate);
        return sortDateAsc ? dateA - dateB : dateB - dateA;
    });
    sortByDateBtn.textContent = sortDateAsc ? "Ngày ↑" : "Ngày ↓";
    renderBookings(sorted);
};
// --- POPULATE FILTERS FROM API ---
async function populateFilters() {
    try {
        const [paymentData, statusData] = await Promise.all([
            getPaymentMethodsApi(),
            getBookingStatusesApi()
        ]);
        
        paymentMethods = paymentData.paymentMethods || {};
        bookingStatuses = statusData.bookingStatuses || {};
        
        // Populate payment filter
        const paymentFilter = document.getElementById("paymentFilter");
        paymentFilter.innerHTML = '<option value="">-- Tất cả phương thức --</option>';
        Object.entries(paymentMethods).forEach(([key, value]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            paymentFilter.appendChild(option);
        });
        
        // Populate status filter
        const statusFilter = document.getElementById("statusFilter");
        statusFilter.innerHTML = '<option value="">-- Tất cả trạng thái --</option>';
        Object.entries(bookingStatuses).forEach(([key, value]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            statusFilter.appendChild(option);
        });
    } catch (err) {
        console.error("Lỗi khi tải bộ lọc:", err);
    }
}

// --- INITIAL LOAD ---
async function init() {
    await populateFilters();
    await fetchBookings();
}

init();
