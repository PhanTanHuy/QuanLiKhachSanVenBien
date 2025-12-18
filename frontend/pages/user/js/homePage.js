// homePage.js - Render danh sách phòng large cho homePage.html

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".rooms-grid");
  if (!grid) return;

  try {
    const res = await fetch("/api/rooms/home");
    const data = await res.json();

    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      grid.innerHTML = "<p>Không có phòng nổi bật.</p>";
      return;
    }

    grid.innerHTML = data.data
      .map(
        (room) => `
        <div class="room-card${room.isLarge ? " large" : ""}">
          <div class="price-tag">
            ${room.price.toLocaleString()} VNĐ/đêm
          </div>

          <img
            src="${room.img || "https://via.placeholder.com/300"}"
            alt="${room.type}"
            class="room-image"
          />

          <div class="room-overlay"></div>

          <div class="room-name">
            ${room.type}
          </div>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error(error);
    grid.innerHTML = "<p>Lỗi tải phòng nổi bật.</p>";
  }
});

const loadHomeRooms = async () => {
  try {
    const res = await fetch("/api/rooms");
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Load rooms failed");
    }

    renderHomeRooms(result.data);
  } catch (error) {
    console.error(error);
  }
};

const renderHomeRooms = (rooms) => {
  const grid = document.querySelector(".rooms-grid");
  if (!grid) return;

  grid.innerHTML = "";

  rooms.forEach((room) => {
    const card = document.createElement("div");
    card.className = room.isLarge ? "room-card large" : "room-card";

    card.innerHTML = `
      <div class="price-tag">
        ${room.price.toLocaleString()} VNĐ/đêm
      </div>

      <img
        src="${room.img || "https://via.placeholder.com/600x800"}"
        class="room-image"
        alt="${room.type}"
        onclick="viewRoom('${room._id}')"
      />

      <div class="room-overlay"></div>

      <div class="room-name">
        ${room.type}
      </div>
    `;

    grid.appendChild(card);
  });
};

const viewRoom = (roomId) => {
  window.location.href = `/user/rooms/${roomId}`;
};

loadHomeRooms();
// ===== PROMOTION ROOM =====
const loadPromotionRoom = async () => {
  try {
    // const res = await fetch("/api/rooms/promotion");
    const res = await fetch("/api/rooms");
    const result = await res.json();

    if (!result.success || !result.data) {
      // Không có phòng khuyến mãi → ẩn section
      document.querySelector(".promotion-section").style.display = "none";
      return;
    }

    const room = result.data;

    // Gán dữ liệu
    document.querySelector(".promotion-image").src =
      room.img || "https://via.placeholder.com/800";

    document.querySelector(".promotion-title").innerText =
      room.type;

    document.querySelector(".discount-number").innerText =
      `${room.discounted}%`;

    document.querySelector(".book-button").onclick = () => {
      window.location.href = `/user/rooms/${room.id}`;
    };
  } catch (err) {
    console.error("Lỗi tải phòng khuyến mãi", err);
  }
};

loadPromotionRoom();

