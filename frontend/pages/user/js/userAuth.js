// userAuth.js - Đăng ký, đăng nhập, lấy tên user lên header, đăng xuất

// Đăng ký
export async function registerUser(formData) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");
  return data;
}

// Đăng nhập
export async function loginUser({ email, password }) {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
  if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
  return data;
}

// Lấy user hiện tại
export async function fetchMe() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const res = await fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

// Đăng xuất
export function logout() {
  fetch("/api/auth/signout", { method: "POST", credentials: "include" })
    .finally(() => {
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    });
}

// Hiển thị tên user và nút đăng xuất trên header


export async function renderHeaderUser() {
  const userIcon = document.querySelector(".user-icon");
  if (!userIcon) return;
  const user = await fetchMe();
  if (user) {
    userIcon.innerHTML = `
      <span class="user-avatar" style="margin-right:6px;">👤</span>
      <span class="user-name" style="font-weight:bold;cursor:pointer;">${user.name || user.email || "User"}</span>
      <span class="user-dropdown-arrow" style="margin-left:4px;cursor:pointer;">▼</span>
      <div class="user-dropdown" id="userDropdown" style="display:none;position:absolute;top:120%;right:0;background:#fff;color:#333;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:1000;min-width:140px;">
        <button id="logoutBtn" style="width:100%;padding:10px 14px;border:none;background:none;text-align:left;font-size:14px;cursor:pointer;color:#333;">Đăng xuất</button>
      </div>
    `;
    userIcon.style.position = "relative";
    const dropdown = userIcon.querySelector("#userDropdown");
    const showDropdown = (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    };
    userIcon.querySelector(".user-avatar").onclick = showDropdown;
    userIcon.querySelector(".user-name").onclick = showDropdown;
    userIcon.querySelector(".user-dropdown-arrow").onclick = showDropdown;
    document.addEventListener("click", () => { dropdown.style.display = "none"; });
    const btn = userIcon.querySelector("#logoutBtn");
    if (btn) btn.onclick = (e) => {
      e.stopPropagation();
      logout();
    };
  } else {
    userIcon.innerHTML = `<a href="/signin" style="color:#fff;">Đăng nhập</a>`;
  }
}

document.addEventListener("DOMContentLoaded", renderHeaderUser);
// Cho phép gọi lại renderHeaderUser từ ngoài module nếu header được load động
window.renderHeaderUser = renderHeaderUser;
