const apiURL = "/api/rooms";

let ALL_ROOMS = [];
let currentFilter = "all";
let keyword = "";

let currentPage = 1;
const PAGE_SIZE = 12;
let totalPages = 1;

const STATUS_LABELS = {
  "đang thuê": "Đang thuê",
  "đã đặt cọc": "Đã đặt cọc",
};

const STATUS_KEYS = {
  "đang thuê": "occupied",
  "đã đặt cọc": "reserved",
};

const defaultBtn = {
  text: "Đặt phòng",
  disabled: false,
  class: "btn-primary",
};

function normalizeStatus(status) {
  if (!status) return "";
  return status.toString().trim().toLowerCase();
}

const RoomStatus = Object.keys(STATUS_LABELS).reduce((acc, k) => {
  acc[k] = STATUS_LABELS[k];
  acc[k.toUpperCase()] = STATUS_LABELS[k];
  return acc;
}, {});

// API
async function getRoomsApi() {
  const response = await fetch(apiURL);
  const data = await response.json();
  return data.data || [];
}

// Load ENUMS
async function addRoomTypes() {
  try {
    const res = await fetch("/api/rooms/enums");
    const data = await res.json();

    const types = data.types || [];
    ROOM_STATUSES = (data.statuses || []).map((st) => ({
      value: st,
      label: st,
    }));

    const newTypeSelect = document.getElementById("roomTypes");
    if (!newTypeSelect) return;
    newTypeSelect.innerHTML = "<option value='0'>-- Tất cả --</option>";
    types.forEach((type) => {
      const opt = createOption(type);
      newTypeSelect.appendChild(opt.cloneNode(true));
    });
  } catch (err) {
    console.error("Lấy enum thất bại", err);
  }
}

function createOption(value) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = value;
  return opt;
}

// Hàm filter
const filterMap = {
  "Danh sách phòng": "all",
  "Đang ở": "đang thuê",
  "Phòng đang đặt cọc": "đã đặt cọc",
};

function initStatusFilter() {
  const filterItems = document.querySelectorAll(".filter-item");
  if (!filterItems) return;

  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      filterItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const text = item.textContent.trim();
      currentFilter = filterMap[text] || "all";

      applyFilters();
    });
  });
}

// Hàm filters
function applyFilters() {
  let rooms = [...ALL_ROOMS];

  // 🔥 CHỈ GIỮ PHÒNG ĐANG THUÊ HOẶC ĐÃ ĐẶT CỌC
  rooms = rooms.filter((r) => {
    const st = normalizeStatus(r.status);
    return st === "đang thuê" || st === "đã đặt cọc";
  });

  if (currentFilter !== "all") {
    rooms = rooms.filter((r) => normalizeStatus(r.status) === currentFilter);
  }

  const typeSelectEl = document.getElementById("roomTypes");
  const typeVal = typeSelectEl ? typeSelectEl.value : "0";
  if (typeVal && typeVal !== "0") {
    rooms = rooms.filter((r) => (r.type || "").toString() === typeVal);
  }

  if (keyword !== "") {
    const k = keyword.toLowerCase();
    rooms = rooms.filter((r) => {
      const id = (r.id || "").toString().toLowerCase();
      const type = (r.type || "").toString().toLowerCase();
      const statusVN = STATUS_LABELS[normalizeStatus(r.status)] || "";
      const statusRaw = normalizeStatus(r.status);

      return (
        id.includes(k) ||
        type.includes(k) ||
        statusVN.toLowerCase().includes(k) ||
        statusRaw.includes(k)
      );
    });
  }

  const priceSelect = document.getElementById("roomPrices");
  const priceVal = priceSelect ? priceSelect.value : null;
  if (priceVal === "1") rooms.sort((a, b) => b.price - a.price);
  if (priceVal === "2") rooms.sort((a, b) => a.price - b.price);

  totalPages = Math.ceil(rooms.length / PAGE_SIZE);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedRooms = rooms.slice(startIndex, startIndex + PAGE_SIZE);

  renderRooms(pagedRooms);
  renderPagination();
}

// Hàm Render
function renderRooms(list) {
  const roomList = document.getElementById("roomList");
  if (!roomList) return console.error("Không tìm thấy roomList trong HTML");
  roomList.innerHTML = "";

  list.forEach((room) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-4";

    const normalized = normalizeStatus(room.status);

    const Status = STATUS_LABELS[normalized] || "Không xác định";

    const buttonMap = {
      "đang thuê": {
        text: "Đang thuê",
        disabled: true,
        class: "btn-secondary",
      },
      "đã đặt cọc": {
        text: "Đã đặt cọc",
        disabled: true,
        class: "btn-warning",
      },
    };

    const btn = buttonMap[normalized] || defaultBtn;

    col.innerHTML = `
      <div class="card shadow-sm room-card">

        <img src="${
          room.img || ""
        }" class="card-img-top room-img-fixed" alt="Phòng ${room.id || ""}">

        <div class="card-body room-body-fixed">
          <h5 class="card-title mb-2">Phòng <strong>${
            room.id || ""
          }</strong></h5>
          <p class="mb-1"><strong>Loại phòng:</strong> ${room.type || ""}</p>
          <p class="mb-1"><strong>Mô tả:</strong> ${room.desc || ""}</p>
          <p class="mb-1"><strong>Giá:</strong> ${
            room.price !== undefined ? room.price.toLocaleString() + " đ" : ""
          }</p>
          <p><strong>Trạng thái:</strong> ${Status}</p>

          <div class="d-flex gap-2">
            <button 
              class="btn ${btn.class} fw-bold flex-fill"
              disabled>
              ${btn.text}
            </button>

            <button 
              class="btn btn-outline-info fw-bold flex-fill"
              onclick="openTenantInfo('${room._id}')">
              Thông tin
            </button>
          </div>

        </div>
      </div>
    `;

    roomList.appendChild(col);
  });
}

let ALL_BOOKINGS = [];
let urlBooking = "/api/bookings";

async function getBookingsApi() {
  const response = await fetch(urlBooking);
  const data = await response.json();
  return data.bookings || [];
}

// Hàm mở modal thông tin khách thuê
function openTenantInfo(roomId) {
  const room = ALL_ROOMS.find((r) => r._id === roomId);
  if (!room) {
    alert("Không tìm thấy phòng");
    return;
  }

  // 🔥 tìm booking theo room._id
  const booking = ALL_BOOKINGS.find((b) => b.room && b.room._id === roomId);

  if (!booking) {
    alert("Phòng này chưa có thông tin đặt phòng");
    return;
  }

  const status = normalizeStatus(booking.status);

  console.log(status);

  const user = booking.userSnapshot || booking.user || {};

  const bodyEl = document.getElementById("tenantModalBody");
  const footerEl = document.getElementById("tenantModalFooter");

  bodyEl.innerHTML = `
    <div class="container-fluid">
      <div class="row g-3">
        <!-- LEFT -->
        <div class="col-md-6">
          <div class="tenant-item m-2">
            <i class="bi bi-envelope"></i>
            <span>${user.email || "—"}</span>
          </div>

          <div class="tenant-item m-2">
            <i class="bi bi-person"></i>
            <span>${user.name || "—"}</span>
          </div>

          <div class="tenant-item m-2">
            <i class="bi bi-telephone"></i>
            <span>${user.phone || "—"}</span>
          </div>

          <div class="tenant-item m-2">
            <i class="bi bi-geo-alt"></i>
            <span>${user.address || "—"}</span>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="col-md-6">
          <div class="tenant-item m-2">
            <i class="bi bi-credit-card"></i>
            <span>${user.cccd || "—"}</span>
          </div>

          <div class="tenant-item m-2">
            <i class="bi bi-calendar-check"></i>
            <span>Check-in: ${formatDate(booking.checkInDate)}</span>
          </div>

          <div class="tenant-item m-2">
            <i class="bi bi-calendar-x"></i>
            <span>Check-out: ${formatDate(booking.checkOutDate)}</span>
          </div>

          <div class="booking-badge m-2">
            ${booking.bookingCode}
          </div>
        </div>
      </div>
    </div>
  `;

  footerEl.innerHTML = `
  <button class="btn btn-outline-dark px-4" data-bs-dismiss="modal">
    Đóng
  </button>
`;

  if (status === "đã đặt cọc") {
    footerEl.innerHTML += `
    <button class="btn btn-success px-4"
      onclick="checkIn('${booking._id}')">
      Check in
    </button>
  `;
  }

  if (status === "đang thuê") {
    footerEl.innerHTML += `
    <button class="btn btn-danger px-4"
      onclick="checkOut('${booking._id}')">
      Check out
    </button>
  `;
  }

  const modal = new bootstrap.Modal(document.getElementById("tenantModal"));
  modal.show();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// Hàm check in, check out
async function checkIn(bookingId) {
  if (!confirm("Xác nhận check in cho khách?")) return;

  try {
    // Update BOOKING
    const bookingRes = await fetch(`/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Đang thuê" }),
    });

    if (!bookingRes.ok) throw new Error("Update booking thất bại");
    const data = await bookingRes.json();
    const booking = data.booking;
    // Update ROOM
    const roomId = booking.room.id;
    console.log(roomId);

    const roomRes = await fetch(`/api/rooms/one/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Đang thuê" }),
    });

    if (!roomRes.ok) throw new Error("Update room thất bại");

    alert("Check in thành công");
    ALL_BOOKINGS = await getBookingsApi();
    ALL_ROOMS = await getRoomsApi();
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Check in thất bại");
  }
}

async function checkOut(bookingId) {
  if (!confirm("Xác nhận check out cho khách?")) return;

  const bookingRes = await fetch(`/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Chờ thanh toán" }),
  });

  if (!bookingRes.ok) throw new Error("Update booking thất bại");
  const data = await bookingRes.json();
  const booking = data.booking;
  // Update ROOM
  const roomId = booking.room.id;

  await fetch(`/api/rooms/one/${roomId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Đang bảo trì" }),
  });

  ALL_BOOKINGS = await getBookingsApi();
  ALL_ROOMS = await getRoomsApi();

  alert("Check out thành công");
  applyFilters();
}

// Hàm render phân trang
function renderPagination() {
  const paginationEl = document.getElementById("pagination");
  if (!paginationEl) return;

  paginationEl.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = "btn btn-sm btn-outline-primary me-1";
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  });
  paginationEl.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `btn btn-sm me-1 ${
      i === currentPage ? "btn-primary" : "btn-outline-primary"
    }`;
    btn.addEventListener("click", () => {
      currentPage = i;
      applyFilters();
    });
    paginationEl.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = "btn btn-sm btn-outline-primary";
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
    }
  });
  paginationEl.appendChild(nextBtn);
}

// Khởi tạo page
async function init() {
  await addRoomTypes();
  const [rooms, bookings] = await Promise.all([
    getRoomsApi(),
    getBookingsApi(),
  ]);

  ALL_ROOMS = rooms;
  ALL_BOOKINGS = bookings;

  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      keyword = this.value.toLowerCase().trim();
      applyFilters();
    });
  }

  initStatusFilter();
  applyFilters();
}

init();
