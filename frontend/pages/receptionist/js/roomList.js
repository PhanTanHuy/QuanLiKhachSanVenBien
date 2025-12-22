const apiURL = "/api/rooms";

let ALL_ROOMS = [];
let currentFilter = "all";
let keyword = "";

let currentPage = 1;
const PAGE_SIZE = 12;
let totalPages = 1;

const STATUS_LABELS = {
  trống: "Trống",
  "đang thuê": "Đang thuê",
  "đã đặt cọc": "Đã đặt cọc",
  "đang bảo trì": "Đang bảo trì",
};

const STATUS_KEYS = {
  trống: "available",
  "đang thuê": "occupied",
  "đã đặt cọc": "reserved",
  "đang bảo trì": "maintenance",
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
  "Phòng trống": "trống",
  "Đang ở": "đang thuê",
  "Đang bảo trì": "đang bảo trì",
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
  console.log("APPLY FILTERS:", rooms);

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
      trống: { text: "Sẵn sàng", disabled: false, class: "btn-success" },
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
      "đang bảo trì": {
        text: "Đang bảo trì",
        disabled: true,
        class: "btn-danger",
      },
    };

    const btn = buttonMap[normalized] || buttonMap["trống"];

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

          <button 
            class="btn ${btn.class} fw-bold w-100 room-btn"
            ${btn.disabled ? "disabled" : ""}
            data-room-id="${room.id}"
            onclick="openBookingModal(${room.id})">
            ${btn.text}
          </button>

        </div>
      </div>
    `;

    roomList.appendChild(col);
  });
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
  ALL_ROOMS = await getRoomsApi();

  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      keyword = this.value.toLowerCase().trim();
      applyFilters();
    });
  } else {
    console.warn("Không tìm thấy .search-input");
  }

  initStatusFilter();

  const roomPrices = document.getElementById("roomPrices");
  if (roomPrices) roomPrices.addEventListener("change", applyFilters);

  const roomTypes = document.getElementById("roomTypes");
  if (roomTypes) roomTypes.addEventListener("change", applyFilters);

  applyFilters();
}

init();

// Mở modal đặt phòng
function openBookingModal(roomId) {
  const modal = new bootstrap.Modal(document.getElementById("bookingModal"));
  document.getElementById("bookingRoomId").value = roomId;
  document.getElementById("accountType").value = "old";

  toggleAccountFields(); // reset form
  modal.show();
}

async function findUserByEmail() {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Vui lòng nhập email!");
    return;
  }

  try {
    console.log("🔍 Đang tìm user theo email:", email);
    const res = await fetch(`/api/account/allUser`);

    const data = await res.json();
    console.log("📌 Tìm thấy user:", data.users);
    const user = data.users.find((u) => u.email === email);

    if (!user) {
      alert("Email không tồn tại trong hệ thống!");
      return;
    }

    // Nếu tìm thấy → tự chuyển sang chế độ "old"
    document.getElementById("accountType").value = "old";
    toggleAccountFields();

    // Tự fill thông tin (chỉ để hiển thị, không cho sửa)
    document.getElementById("name").value = user.name || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("cccd").value = user.cccd || "";
    document.getElementById("address").value = user.address || "";

    console.log("📌 USER FOUND:", user);

    alert("Đã tìm thấy thông tin khách hàng!");
  } catch (err) {
    console.error("❌ Lỗi khi tìm user:", err);
    alert("Không thể tìm user. Kiểm tra lại server!");
  }
}

function toggleAccountFields() {
  const type = document.getElementById("accountType").value;
  const fields = document.getElementById("newUserFields");

  if (type === "new") {
    fields.style.display = "block";

    // Cho phép nhập
    document.getElementById("name").disabled = false;
    document.getElementById("phone").disabled = false;
    document.getElementById("cccd").disabled = false;
    document.getElementById("address").disabled = false;
  } else {
    fields.style.display = "block"; // Vẫn hiển thị nhưng khóa lại
    document.getElementById("name").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("cccd").disabled = true;
    document.getElementById("address").disabled = true;
  }
}

function toggleDepositAmount() {
  const bookingType = document.querySelector(
    'input[name="bookingType"]:checked'
  ).value;

  const wrapper = document.getElementById("depositAmountWrapper");
  const input = document.getElementById("depositAmount");

  if (bookingType === "deposit") {
    wrapper.classList.remove("d-none");
    input.required = true;

    const totalRent = calculateTotalRent();
    const depositAmount = Math.round(totalRent * 0.3);

    input.value = depositAmount > 0 ? depositAmount : "";
  } else {
    wrapper.classList.add("d-none");
    input.required = false;
    input.value = "";
  }
}

function calculateTotalRent() {
  const checkIn = document.getElementById("checkInDate").value;
  const checkOut = document.getElementById("checkOutDate").value;

  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 0;

  const room = ALL_ROOMS.find(
    (r) => r.id === document.getElementById("bookingRoomId").value
  );

  if (!room) return 0;

  return diffDays * room.price;
}

document
  .getElementById("checkInDate")
  .addEventListener("change", autoUpdateDeposit);
document
  .getElementById("checkOutDate")
  .addEventListener("change", autoUpdateDeposit);

function autoUpdateDeposit() {
  const bookingType = document.querySelector(
    'input[name="bookingType"]:checked'
  ).value;

  if (bookingType === "deposit") {
    toggleDepositAmount();
  }
}

async function submitBooking() {
  const roomId = document.getElementById("bookingRoomId").value;
  const accountType = document.getElementById("accountType").value;
  const bookingType = document.querySelector(
    "input[name='bookingType']:checked"
  ).value;

  const email = document.getElementById("email").value.trim();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cccd = document.getElementById("cccd").value.trim();
  const address = document.getElementById("address").value.trim();

  const checkInDate = document.getElementById("checkInDate").value;
  const checkOutDate = document.getElementById("checkOutDate").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  const deposit = document.getElementById("depositAmount").value || 0;

  // Validation cơ bản
  if (!email) {
    alert("Vui lòng nhập email.");
    return;
  }
  if (!checkInDate || !checkOutDate) {
    alert("Vui lòng chọn ngày Check-in và Check-out.");
    return;
  }
  if (new Date(checkInDate) > new Date(checkOutDate)) {
    alert("Check-in phải trước hoặc bằng Check-out.");
    return;
  }

  // Tạo payload rõ ràng (không dùng shorthand với biến chưa khai báo)
  const payload = {
    email,
    name: name,
    phone: phone,
    cccd: cccd,
    address: address,
    roomId,
    checkInDate,
    checkOutDate,
    paymentMethod,
    status: bookingType === "rent" ? "Đang thuê" : "Đã đặt cọc",
    deposit,
    accountType,
  };

  console.log("📌 DATA GỬI API:", payload);

  try {
    const res = await fetch("/api/bookings/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Đặt phòng thất bại");

    // Tạm thời giả lập thành công:
    alert("Đặt phòng thành công!");
    try {
      // Cập nhật trạng thái phòng tại client
      const res = await fetch(`/api/rooms/one/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: payload.status }),
      });
      if (!res.ok) {
        console.error("Cập nhật trạng thái phòng thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái phòng: ", err);
    }
    // Ẩn modal
    const modalEl = document.getElementById("bookingModal");
    const modal =
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();

    // Option: refresh danh sách phòng hoặc cập nhật ALL_ROOMS tại client
    // Refresh data
    ALL_ROOMS = await getRoomsApi();
    applyFilters();
  } catch (err) {
    console.error("Lỗi khi gửi booking:", err);
    alert("Có lỗi khi gửi đặt phòng: " + (err.message || err));
  }
}
