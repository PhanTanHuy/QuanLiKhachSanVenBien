let ALL_BOOKINGS = [];
let FILTERED_BOOKINGS = [];

let currentPage = 1;
let rowsPerPage = 10;
let totalPages = 1;

let CURRENT_BOOKING = null;

async function fetchBookings() {
  try {
    const response = await fetch("/api/bookings");
    const data = await response.json();

    ALL_BOOKINGS = data.bookings || [];

    console.log("Tất cả booking:", ALL_BOOKINGS);

    // 🔥 LẤY CẢ 2 TRẠNG THÁI
    FILTERED_BOOKINGS = ALL_BOOKINGS.filter(
      (b) => b.status === "Đã đặt cọc" || b.status === "Đã thanh toán"
    );

    totalPages = Math.ceil(FILTERED_BOOKINGS.length / rowsPerPage);

    renderTable();
    renderPagination();
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
}

function renderTable() {
  const tableBody = document.getElementById("booking-table-body");
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const bookingsToDisplay = FILTERED_BOOKINGS.slice(start, end);

  bookingsToDisplay.forEach((booking) => {
    const actionButton =
      booking.status === "Đã đặt cọc"
        ? `
          <button class="btn btn-sm btn-danger"
            onclick="payBooking('${booking.bookingCode}')">
            <i class="bi bi-cash"></i> Thanh toán
          </button>
        `
        : `
          <button class="btn btn-sm btn-outline-primary"
            onclick="viewInvoice('${booking.bookingCode}')">
            <i class="bi bi-eye"></i> Xem
          </button>
        `;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${booking.room?.id || "-"}</td>
      <td>${booking.userSnapshot?.name || "-"}</td>
      <td>${booking.userSnapshot?.email || "-"}</td>
      <td>${booking.userSnapshot?.phone || "-"}</td>
      <td>${booking.userSnapshot?.cccd || "-"}</td>
      <td>
        <span class="badge ${
          booking.status === "Đã đặt cọc"
            ? "bg-warning text-dark"
            : "bg-success"
        }">
          ${booking.status}
        </span>
      </td>
      <td class="text-center">
        ${actionButton}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "pagination justify-content-center";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = i;

    a.onclick = (e) => {
      e.preventDefault();
      currentPage = i;
      renderTable();
      renderPagination();
    };

    li.appendChild(a);
    ul.appendChild(li);
  }

  pagination.appendChild(ul);
}

function payBooking(bookingId) {
  const booking = ALL_BOOKINGS.find((b) => b.bookingCode === bookingId);
  if (!booking) return;

  CURRENT_BOOKING = booking;

  console.log("Thanh toán booking:", CURRENT_BOOKING);

  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);

  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const pricePerDay = booking.room.price;
  const deposit = booking.deposit;
  const total = days * pricePerDay - deposit;

  document.getElementById("payRoom").innerText = booking.room.id;
  document.getElementById("payDays").innerText = days + " ngày";
  document.getElementById("payPrice").innerText =
    pricePerDay.toLocaleString("vi-VN") + " ₫";
  document.getElementById("payDeposit").innerText =
    booking.deposit.toLocaleString("vi-VN") + " ₫";

  document.getElementById("payTotal").innerText =
    total.toLocaleString("vi-VN") + " ₫";
  document.getElementById("payDate").innerText = new Date().toLocaleDateString(
    "vi-VN"
  );
  document.getElementById("payMethod").innerText = booking.paymentMethod;

  const modal = new bootstrap.Modal(document.getElementById("paymentModal"));
  modal.show();
}

async function confirmPayment() {
  if (!CURRENT_BOOKING) return;

  console.log("Confirm payment for booking:", CURRENT_BOOKING);
  console.log("Booking ID:", CURRENT_BOOKING._id);
  console.log("Booking Code:", CURRENT_BOOKING.bookingCode);

  try {
    const token = localStorage.getItem("accessToken");
    // Cập nhật booking status thành PAID
    const bookingResponse = await fetch(`/api/bookings/${CURRENT_BOOKING.bookingCode}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: "Đã thanh toán" }),
    });

    if (!bookingResponse.ok) {
      throw new Error("Lỗi cập nhật booking");
    }

    // Cập nhật room status thành OCCUPIED
    const roomResponse = await fetch(`/api/rooms/${CURRENT_BOOKING.room._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Đang thuê" }),
    });

    if (!roomResponse.ok) {
      throw new Error("Lỗi cập nhật phòng");
    }

    alert("Thanh toán thành công!");
    // Refresh data
    fetchBookings();
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("paymentModal"));
    modal.hide();
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    alert("Lỗi thanh toán: " + error.message);
  }
}

function viewInvoice(bookingCode) {
  console.log("Xem hóa đơn booking:", bookingCode);

  fetch(`/api/payment/getPaymentByBookingCode/${bookingCode}`)
    .then((res) => {
      if (!res.ok) throw new Error("Không tìm thấy hóa đơn");
      return res.json();
    })
    .then((payment) => {
      console.log("Dữ liệu hóa đơn:", payment);

      // tìm booking tương ứng (để lấy info phòng)
      const booking = ALL_BOOKINGS.find(
        (b) => b.bookingCode === payment.bookingCode
      );

      document.getElementById("invBookingCode").innerText = payment.bookingCode;
      document.getElementById("invRoom").innerText = booking?.room?.id || "-";

      document.getElementById("invAmount").innerText =
        payment.totalPrice.toLocaleString("vi-VN") + " ₫";

      document.getElementById("invDeposit").innerText =
        (payment.depositAmount || 0).toLocaleString("vi-VN") + " ₫";

      document.getElementById("invTotal").innerText =
        (payment.totalPrice + payment.depositAmount).toLocaleString("vi-VN") + " ₫";

      document.getElementById("invMethod").innerText = payment.paymentMethod;

      document.getElementById("invDate").innerText = new Date(
        payment.createdAt
      ).toLocaleDateString("vi-VN");

      const modal = new bootstrap.Modal(
        document.getElementById("invoiceModal")
      );
      modal.show();
    })
    .catch((err) => {
      console.error(err);
      alert("Không lấy được hóa đơn!");
    });
}

// Khởi tạo
function init() {
  fetchBookings();

  // Filter click
  document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const filterText = item.textContent;
      if (filterText === 'Tất cả') {
        FILTERED_BOOKINGS = ALL_BOOKINGS.filter(
          (b) => b.status === "Đã đặt cọc" || b.status === "Đã thanh toán"
        );
      } else if (filterText === 'Đã đặt cọc') {
        FILTERED_BOOKINGS = ALL_BOOKINGS.filter(b => b.status === "Đã đặt cọc");
      } else if (filterText === 'Đã thanh toán') {
        FILTERED_BOOKINGS = ALL_BOOKINGS.filter(b => b.status === "Đã thanh toán");
      }

      currentPage = 1;
      renderTable();
      renderPagination();
    });
  });
}
init();
