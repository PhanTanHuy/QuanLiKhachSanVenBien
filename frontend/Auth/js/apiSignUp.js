const form = document.getElementById("signupForm");
const errorMessages = form.querySelectorAll(".error-message");

function clearErrors() {
  errorMessages.forEach((el) => {
    el.textContent = "";
    el.classList.add("hidden");
  });
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorEl = input.parentElement.querySelector(".error-message");
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cccd = document.getElementById("cccd").value.trim();
  const address = document.getElementById("address").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  let hasError = false;

  if (!name) {
    showError("name", "Vui lòng nhập họ tên");
    hasError = true;
  }

  if (!email) {
    showError("email", "Email không được để trống");
    hasError = true;
  }

  if (!phone) {
    showError("phone", "Số điện thoại không được để trống");
    hasError = true;
  }

  if (!password) {
    showError("password", "Mật khẩu không được để trống");
    hasError = true;
  }

  if (password !== confirmPassword) {
    showError("confirmPassword", "Mật khẩu xác nhận không khớp");
    hasError = true;
  }

  if (hasError) return;

  const payload = { name, email, phone, cccd, address, password };

  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // lỗi từ backend (email trùng, phone trùng...)
      alert(data.message || "Đăng ký thất bại");
      return;
    }

    alert("Đăng ký thành công! Vui lòng đăng nhập");
    window.location.href = "/signin";
  } catch (err) {
    console.error(err);
    alert("Không thể kết nối server");
  }
});
