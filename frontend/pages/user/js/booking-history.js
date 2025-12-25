document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Vui lòng đăng nhập");
    location.href = "/signin";
    return;
  }

  loadBookings();

  // Filter tabs
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab")
        .forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      loadBookings(tab.dataset.status);
    });
  });
});

async function loadBookings(status = "") {
  const token = localStorage.getItem("accessToken");

  let url = "/api/bookings/my";
  if (status) url += `?status=${status}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const result = await res.json();
  if (!result.success) {
    alert("Không tải được lịch sử đặt phòng");
    return;
  }

  renderBookings(result.data);
}

function renderBookings(bookings) {
  const container = document.querySelector(".rooms-container");
  container.innerHTML = "";

  if (!bookings || bookings.length === 0) {
    container.innerHTML = "<p>Không có đặt phòng nào</p>";
    return;
  }

  bookings.forEach(b => {
    const canCancel = b.status === "RESERVED";

    const roomImage =
      b.room?.img ||
      b.room?.image ||
      b.room?.images?.[0] ||
      "https://via.placeholder.com/400";

    container.innerHTML += `
      <div class="room-card">
        <img src="${roomImage}" class="room-image" />

        <div class="room-details">
          <div>
            <div class="room-header">
              <div class="room-code">Mã đặt phòng: ${b.bookingCode}</div>
            </div>

            <div class="room-type">
              Loại phòng: ${b.roomSnapshot?.type || "Không xác định"}
            </div>

            <div class="room-info">
              <div class="room-info-item">Ngày nhận: ${formatDate(b.checkInDate)}</div>
              <div class="room-info-item">Ngày trả: ${formatDate(b.checkOutDate)}</div>
              <div class="room-info-item">Số đêm: ${b.nights} đêm</div>
              <div class="room-info-item">Giá: ${b.pricePerNight.toLocaleString()}đ / đêm</div>
              <div class="room-info-item">Tổng tiền: ${b.totalPrice.toLocaleString()}đ</div>
              <div class="room-info-item">Đặt cọc: ${b.deposit.toLocaleString()}đ</div>
              <div class="room-info-item">Trạng thái: ${translateStatus(b.status)}</div>
            </div>
          </div>

          <div class="room-actions">
            ${
              canCancel
                ? `<button class="btn-detail" onclick="cancelBooking('${b.bookingCode}')">Hủy</button>`
                : `<span class="badge-full">${translateStatus(b.status)}</span>`
            }
          </div>
        </div>
      </div>
    `;
  });
}

async function cancelBooking(code) {
  if (!confirm("Bạn chắc chắn muốn hủy booking này?")) return;

  const token = localStorage.getItem("accessToken");

  const res = await fetch(`/api/bookings/cancel/${code}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  });

  const result = await res.json();
  alert(result.message || "Đã hủy");

  loadBookings();
}

// Helpers
function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN");
}

function translateStatus(status) {
  switch (status) {
    case "RESERVED": return "Đã đặt";
    case "OCCUPIED": return "Đang ở";
    case "COMPLETED": return "Hoàn tất";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
}
