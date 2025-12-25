document.addEventListener("DOMContentLoaded", async () => {


  // CHECK LOGIN

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Vui lòng đăng nhập");
    return location.href = "/signin";
  }


  // GET roomId

  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("roomId");

  if (!roomId) {
    alert("Thiếu roomId");
    return location.href = "/user/rooms";
  }


  const checkInInput = document.getElementById("checkInDate");
  const checkOutInput = document.getElementById("checkOutDate");

  let pricePerNight = 0;
  let preview = {};


  // LOAD ROOM

  const res = await fetch(`/api/rooms/${roomId}`);
  const { data } = await res.json();

  pricePerNight = data.price;

  document.getElementById("roomName").innerText = data.name || `Phòng ${data.id}`;
  document.getElementById("roomDesc").innerText = data.desc || "";
  document.getElementById("roomImage").src = data.img;


  // DATE LOGIC

  const today = new Date().toISOString().split("T")[0];
  checkInInput.min = today;
  checkOutInput.min = today;

  checkInInput.onchange = () => {
    checkOutInput.min = checkInInput.value;
    calculate();
  };

  checkOutInput.onchange = calculate;

  function calculate() {
    if (!checkInInput.value || !checkOutInput.value) return;

    const inD = new Date(checkInInput.value);
    const outD = new Date(checkOutInput.value);

    if (outD <= inD) return;

    const nights = (outD - inD) / 86400000;
    const total = nights * pricePerNight;
    const deposit = Math.round(total * 0.3);

    preview = { nights, total, deposit };

    document.getElementById("totalPrice").innerText =
      total.toLocaleString("vi-VN") + " VNĐ";

    document.getElementById("nightCount").innerText =
      `(${nights} đêm)`;
  }


  // OPEN MODAL

  document.getElementById("btnOpenModal").onclick = () => {
    if (!preview.total) return alert("Vui lòng chọn ngày");

    document.getElementById("cf-room").innerText = roomId;
    document.getElementById("cf-date").innerText =
      `${checkInInput.value} → ${checkOutInput.value}`;
    document.getElementById("cf-nights").innerText = preview.nights;
    document.getElementById("cf-total").innerText =
      preview.total.toLocaleString("vi-VN") + " VNĐ";
    document.getElementById("cf-deposit").innerText =
      preview.deposit.toLocaleString("vi-VN") + " VNĐ";

    openModal();
  };


  // SUBMIT

  document.getElementById("btnSubmitBooking").onclick = async () => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        roomId,
        checkInDate: checkInInput.value,
        checkOutDate: checkOutInput.value,
        paymentMethod: document.getElementById("paymentMethod").value
      })
    });
    
    const result = await res.json();
    
if (!res.ok || !result.success) {
  return alert(result.message || "Đặt phòng thất bại");
}

    alert("🎉 Đặt phòng thành công");
    location.href = "/user/home";
  };
});

// =====================
function openModal() {
  document.getElementById("confirmModal").classList.add("active");
}
function closeModal() {
  document.getElementById("confirmModal").classList.remove("active");
}
