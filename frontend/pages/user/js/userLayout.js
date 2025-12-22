async function loadLayout() {
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  if (headerContainer) {
    const headerHtml = await fetch("/pages/user/component/header.html").then(res => res.text());
    headerContainer.innerHTML = headerHtml;
  }

  if (footerContainer) {
    const footerHtml = await fetch("/pages/user/component/footer.html").then(res => res.text());
    footerContainer.innerHTML = footerHtml;
  }

  initHeaderEvents(); 
}
const initHeaderEvents = async () => {
  const loginBtn = document.getElementById("loginBtn");
  const userWrapper = document.getElementById("userWrapper");
  const userIcon = document.getElementById("userIcon");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.getElementById("userName");
  const userInitialEl = document.getElementById("userInitial");
  const userAvatarEl = document.getElementById("userAvatar");
  const userAvatarInitialEl = document.getElementById("userAvatarInitial");

  if (!loginBtn || !userWrapper) {
    console.error("Header elements not found");
    return;
  }

  const token = localStorage.getItem("accessToken");

  if (!token) {
    loginBtn.classList.remove("hidden");
    userWrapper.classList.add("hidden");
    return;
  }

  loginBtn.classList.add("hidden");
  userWrapper.classList.remove("hidden");

  // Toggle dropdown
  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
  });

  // Close dropdown when click outside
  document.addEventListener("click", (e) => {
    if (!userWrapper.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
  });

  // Fetch user info
  try {
    const res = await fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    console.log("✅ User data:", data);

    const userName = data.user.name || "User";
    const userInitial = userName.charAt(0).toUpperCase();

    // ✅ CẬP NHẬT AN TOÀN - KIỂM TRA NULL TRƯỚC KHI SET
    if (userNameEl) userNameEl.textContent = userName;
    if (userInitialEl) userInitialEl.textContent = userInitial;
    if (userAvatarInitialEl) userAvatarInitialEl.textContent = userInitial;

    // ✅ CHỈ CẬP NHẬT AVATAR NẾU CÓ VÀ ELEMENT TỒN TẠI
    if (data.user.avatar && userIcon && userAvatarEl) {
      // Kiểm tra avatar có tồn tại không
      const img = new Image();
      img.onload = () => {
        // Avatar load thành công
        userIcon.innerHTML = `<img src="${data.user.avatar}" alt="${userName}">`;
        userAvatarEl.innerHTML = `<img src="${data.user.avatar}" alt="${userName}">`;
      };
      img.onerror = () => {
        // Avatar lỗi, giữ chữ cái
        console.warn("Avatar failed to load, using initial");
      };
      img.src = data.user.avatar;
    }

  } catch (err) {
    console.error("❌ Error fetching user info:", err);
    
    // ✅ FALLBACK: Hiển thị default
    if (userNameEl) userNameEl.textContent = "User";
    if (userInitialEl) userInitialEl.textContent = "U";
    if (userAvatarInitialEl) userAvatarInitialEl.textContent = "U";
    
    // ⚠️ Chỉ logout nếu token thực sự invalid (401)
    if (err.message.includes("401")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    }
  }

  // Logout handler
  logoutBtn?.addEventListener("click", async () => {
    if (!confirm("Bạn có chắc muốn đăng xuất?")) return;

    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("accessToken");
    window.location.href = "/signin";
  });
}

window.addEventListener("DOMContentLoaded", loadLayout);

