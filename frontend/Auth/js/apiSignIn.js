const API_URL = "http://localhost:3000/api/auth/signin"; 

const form = document.getElementById("signInForm");


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const errUser = document.getElementById("errUsername");
  const errPass = document.getElementById("errPassword");

  // Reset lỗi
  errUser.textContent = "";
  errPass.textContent = "";
  errUser.classList.add("hidden");
  errPass.classList.add("hidden");

  let valid = true;

  // =====  CHECK USERNAME =====
  if (!username) {
    errUser.textContent = "Vui lòng nhập tên đăng nhập";
    errUser.classList.remove("hidden");
    valid = false;
  } 
  else if (username.length < 3) {
    errUser.textContent = "Tên đăng nhập phải có ít nhất 3 ký tự";
    errUser.classList.remove("hidden");
    valid = false;
  }
  else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errUser.textContent = "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới";
    errUser.classList.remove("hidden");
    valid = false;
  }

  // =====  CHECK PASSWORD =====
  if (!password) {
    errPass.textContent = "Vui lòng nhập mật khẩu";
    errPass.classList.remove("hidden");
    valid = false;
  }
  else if (password.length < 6) {
    errPass.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
    errPass.classList.remove("hidden");
    valid = false;
  }

  // Nếu có lỗi → không gọi API
  if (!valid) return;

  // ===== CALL API =====
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errPass.textContent = data.message || "Sai tài khoản hoặc mật khẩu";
      errPass.classList.remove("hidden");
      return;
    }

    alert("🎉 Đăng nhập thành công!");
    window.location.href = "index.html";

  } catch (err) {
    alert("Không thể kết nối tới server!");
    console.error(err);
  }
});
