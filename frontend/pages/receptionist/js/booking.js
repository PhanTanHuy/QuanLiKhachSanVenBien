const apiURL = "http://localhost:3000/api/rooms";

let ALL_ROOMS = [];
let currentFilter = "all";
let keyword = "";

let currentPage = 1;
const PAGE_SIZE = 12;
let totalPages = 1;

const STATUS_LABELS = {
  occupied: "Đang thuê",
  reserved: "Đã đặt cọc",
};

const Status_Room = Object.keys(STATUS_LABELS).reduce((acc, k) => {
  acc[k] = STATUS_LABELS[k];
  acc[k.toUpperCase()] = STATUS_LABELS[k];
  return acc;
}, {});

async function getRoomsApi() {
  const response = await fetch(apiURL);
  const data = await response.json();
  return data;
}

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

function applyFilters() {
  let rooms = [...ALL_ROOMS];
  rooms = rooms.filter((r) => r.status == "occupied" || r.status == "reserved");

  if (currentFilter !== "all") {
    rooms = rooms.filter(
      (r) => (r.status || "").toLowerCase() === currentFilter.toLowerCase()
    );
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
      const statusLabel = (RoomStatus[r.status] || "").toString().toLowerCase();
      const statusKey = (r.status || "").toString().toLowerCase();
      return (
        id.includes(k) ||
        type.includes(k) ||
        statusLabel.includes(k) ||
        statusKey.includes(k)
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

function renderRooms(list) {
  const roomList = document.getElementById("roomList");
  if (!roomList) return console.error("Không tìm thấy roomList trong HTML");
  roomList.innerHTML = "";

  list.forEach((room) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-4";

    const status =
      STATUS_LABELS[(room.status || "").toString().toLowerCase()] ||
      "Không xác định";

    const buttonMap = {
      available: { text: "Sẵn sàng", disabled: false, class: "btn-success" },
      occupied: { text: "Đang thuê", disabled: true, class: "btn-secondary" },
      reserved: { text: "Đã đặt cọc", disabled: true, class: "btn-warning" },
      maintenance: { text: "Bảo trì", disabled: true, class: "btn-danger" },
    };

    const btn =
      buttonMap[(room.status || "").toString().toLowerCase()] ||
      buttonMap["available"];

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
          <p><strong>Trạng thái:</strong> ${status}</p>

          <button 
            class="btn ${btn.class} fw-bold w-100 room-btn"
            ${btn.disabled ? "disabled" : ""}>
            ${btn.text}
          </button>
        </div>
      </div>
    `;

    roomList.appendChild(col);
  });
}

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

async function init() {
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
