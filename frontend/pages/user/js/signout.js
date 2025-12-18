document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.getElementById("userIcon");
  const dropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.getElementById("userName");

  if (!userIcon || !logoutBtn) return;

  // toggle dropdown
  userIcon.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  const token = localStorage.getItem("accessToken");

  if (!token) {
    window.location.href = "/signin";
    return;
  } else {
    userNameEl.textContent = "Xin chào 👋";
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
    } catch (err) {
      console.error(err);
      alert("Không thể đăng xuất");
    }
  });
});
