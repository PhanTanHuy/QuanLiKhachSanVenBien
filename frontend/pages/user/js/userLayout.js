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

async function initHeaderEvents() {
  const loginBtn = document.getElementById("loginBtn");
  const userWrapper = document.getElementById("userWrapper");
  const userIcon = document.getElementById("userIcon");
  const dropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.getElementById("userName");

  if (!loginBtn || !userWrapper) return;

  const token = localStorage.getItem("accessToken");

  // ❌ CHƯA LOGIN
  if (!token) {
    loginBtn.classList.remove("hidden");
    userWrapper.classList.add("hidden");
    return;
  }

  // ✅ ĐÃ LOGIN
  loginBtn.classList.add("hidden");
  userWrapper.classList.remove("hidden");

  userIcon.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  try {
    const res = await fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    userNameEl.textContent = data.user.name || "User";

const avatarEl = document.getElementById("userAvatar");
if (avatarEl && data.user.name) {
  avatarEl.textContent = data.user.name.charAt(0).toUpperCase();
}

  } catch (err) {
    localStorage.removeItem("accessToken");
    window.location.href = "/signin";
  }

  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("accessToken");
    window.location.href = "/signin";
  });
}

window.addEventListener("DOMContentLoaded", loadLayout);
