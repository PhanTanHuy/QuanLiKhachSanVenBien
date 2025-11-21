const apiURL = "http://localhost:3000/api/rooms";

async function getRoomsApi() {
  const response = await fetch(apiURL);
  const data = await response.json();
  return data;
}

// Render Room
async function renderRooms() {
  const rooms = await getRoomsApi();
  console.log(rooms);
  
  const roomList = document.getElementById("roomList");
  if (!roomList) return console.error("Không tìm thấy roomList trong HTML");
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const card = document.createElement("div");
    card.className = "room-card";
    card.dataset.id = room.id;
    card.innerHTML = `
    <div class="row align-items-center mb-3 pb-md-4">
        <div class="col-md-4">
            <img src="${room.img}"
            class="img-fluid rounded room-img" alt="Phòng ${room.id}">
        </div>
        <div class="col-md-8 mt-4 mt-md-0">
            <div class="room-code d-flex align-items-center mb-2">
                <span class="me-3">Mã phòng <strong>${room.id}</strong></span>
                <div class="divider flex-grow-1"></div>
                <i class="bi bi-suit-diamond-fill ms-2"></i>
            </div>
            <h4 class="room-title">${room.type}</h4>
            <p class="room-desc">${room.desc}</p>
            <p>Trạng thái: ${
              room.status === "available"
                ? "Trống"
                : room.status === "occupied"
                ? "Đang thuê"
                : "Đã đặt cọc"
            }</p>
            <button type="button" class="btn room-ready-btn px-4 py-2 fw-bold">Sẵn sàng</button>
        </div>
    </div>`;
    roomList.appendChild(card);
  });
}

renderRooms();