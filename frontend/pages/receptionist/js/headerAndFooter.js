// Load Header

function initHeaderAuth() {
  const logoutBtn = document.getElementById("logoutBtn");
  const token = localStorage.getItem("accessToken");

  if (token && logoutBtn) {
    logoutBtn.classList.remove("d-none");
  }

  logoutBtn?.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn đăng xuất không?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/signin";
    }
  });
}

fetch("/pages/receptionist/components/headerReceptionist.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header").innerHTML = data;
    initHeaderAuth();
  });

// Load Footer
fetch("/pages/receptionist/components/footerReceptionist.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
