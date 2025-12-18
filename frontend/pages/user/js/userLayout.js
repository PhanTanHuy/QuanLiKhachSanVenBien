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
  const userIcon = document.getElementById("userIcon");
  const dropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.getElementById("userName");

  if (!userIcon || !logoutBtn || !userNameEl) return;

  // toggle dropdown
  userIcon.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  const token = localStorage.getItem("accessToken");

  // ❌ chưa đăng nhập
  if (!token) {
    userNameEl.textContent = "Chưa đăng nhập";
    logoutBtn.style.display = "none";
    return;
  }

  //  đăng nhập → gọi /me
  try {
    const res = await fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Token invalid");

    const data = await res.json();

    userNameEl.textContent = ` ${data.user.name || "User"}`;
    logoutBtn.style.display = "block";
  } catch (err) {
    console.error(err);
    localStorage.removeItem("accessToken");
    window.location.href = "/signin";
  }

  // logout
  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    } catch {
      alert("Không thể đăng xuất");
    }
  });
}

window.addEventListener("DOMContentLoaded", loadLayout);
