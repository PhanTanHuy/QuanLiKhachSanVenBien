let currentPage = 1;
const limit = 6;

async function loadRooms(page = 1) {
  try {
    const res = await fetch(`http://localhost:3000/api/rooms?page=${page}&limit=${limit}`);
    const result = await res.json();

    if (!result.success) {
      throw new Error("API lỗi");
    }

    renderRooms(result.data);
    renderPagination(result.pagination);
  } catch (err) {
    console.error(err);
    document.getElementById("roomList").innerHTML =
      "<p>Lỗi tải danh sách phòng</p>";
  }
}

function renderRooms(rooms) {
  const roomList = document.getElementById("roomList");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    roomList.innerHTML = "<p>Không có phòng nào</p>";
    return;
  }

  rooms.forEach((room) => {
    roomList.innerHTML += `
      <div class="product-card">
        <img src="${room.img || "https://via.placeholder.com/300"}"
             class="product-image">

        <div class="product-info">
          <div>
            <div class="product-category">${room.type}</div>
            <h2 class="product-title">Phòng ${room.id}</h2>
            <p class="product-description">
              ${room.desc || "Chưa có mô tả"}
            </p>
          </div>

          <div>
            <div class="product-price">
              ${room.price.toLocaleString()} VND
            </div>
            <button 
              class="detail-button"
              onclick="viewRoom('${room._id}')">
              Xem phòng ngay
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function renderPagination({ page, totalPages }) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  // Prev
  if (page > 1) {
    pagination.innerHTML += `
        <button onclick="changePage(${page - 1})">«</button>
      `;
  }

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
        <button
          class="${i === page ? "active" : ""}"
          onclick="changePage(${i})"
        >
          ${i}
        </button>
      `;
  }

  // Next
  if (page < totalPages) {
    pagination.innerHTML += `
        <button onclick="changePage(${page + 1})">»</button>
      `;
  }
}

function changePage(page) {
  currentPage = page;
  loadRooms(currentPage);
}


function viewRoom(roomId) {
 window.location.href = `/user/rooms/${roomId}`;
}

loadRooms();
