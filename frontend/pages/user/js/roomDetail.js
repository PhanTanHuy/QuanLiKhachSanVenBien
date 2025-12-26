const roomId = window.location.pathname.split("/").pop();

async function loadRoomDetail() {
  try {
    const res = await fetch(`/api/rooms/${roomId}`);
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    renderRoom(result.data);
    loadReviews?.(roomId);

    // 
    bindBookingButton();

  } catch (err) {
    console.error(err);
    alert("Lỗi tải thông tin phòng");
  }
}

function renderRoom(room) {
  document.querySelector(".hotel-name").innerText =
    `Phòng ${room.id}`;

  document.querySelector(".room-type").innerText =
    `(${room.type})`;

  document.querySelector(".room-description").innerText =
    room.desc || "Chưa có mô tả";

  document.querySelector(".price span:last-child").innerText =
    room.price.toLocaleString();

  document.querySelector(".main-image img").src =
    room.img || "https://via.placeholder.com/1000";
}

// 👇 tách riêng cho clean code
function bindBookingButton() {
  const btn = document.querySelector(".book-button");
  if (!btn) return;

  btn.addEventListener("click", () => {
      window.location.href = `/user/booking?roomId=${roomId}`;
  });
}

loadRoomDetail();


// ================= REVIEWS =================
async function loadReviews(roomId) {
  try {
    const res = await fetch(`/api/reviews/${roomId}`);
    const reviews = await res.json();

    const grid = document.querySelector(".reviews-grid");
    grid.innerHTML = "";

    if (reviews.length === 0) {
      grid.innerHTML = "<p>Chưa có đánh giá</p>";
      return;
    }

    reviews.forEach(r => {
      grid.innerHTML += `
        <div class="review-card">
          <div class="reviewer-info">
            <div class="reviewer-avatar">${r.userName?.[0] || "U"}</div>
            <span class="reviewer-name">${r.userName || "Ẩn danh"}</span>
          </div>
          <div class="review-stars">${"★".repeat(r.rating)}</div>
          <p class="review-text">${r.comment}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error("Lỗi load review", err);
  }
}

// ================= ADD REVIEW =================
document.querySelector(".submit-review-btn")
  .addEventListener("click", async () => {
    const comment = document.querySelector(".review-input").value;
    if (!comment) return alert("Vui lòng nhập đánh giá");

    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        userName: "Guest",
        rating: 5,
        comment
      })
    });

    document.querySelector(".review-input").value = "";
    loadReviews(roomId);
  });

loadRoomDetail();
function bindBookingButton() {
  const btn = document.querySelector(".book-button");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = `/user/booking?roomId=${roomId}`;
  });
}
