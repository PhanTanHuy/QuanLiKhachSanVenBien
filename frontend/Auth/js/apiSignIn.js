window.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("signInForm");
  if (!form) return;
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errEmail = document.getElementById("errEmail");
  const errPass = document.getElementById("errPassword");
  const globalError = document.getElementById("globalError");

  // Helper: show error with animation

  function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove("hidden");
    element.style.color = "#d32f2f";
    element.style.fontWeight = "bold";
    element.style.transition = "all 0.2s";
    element.style.transform = "scale(1.08)";
    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, 200);
  }

  function clearError(element) {
    if (!element) return;
    element.textContent = "";
    element.classList.add("hidden");
    element.style.color = "";
    element.style.fontWeight = "";
    element.style.transform = "";
  }

  function showGlobalError(message) {
    if (!globalError) return;
    globalError.textContent = message;
    globalError.classList.remove("hidden");
    globalError.style.color = "#d32f2f";
    globalError.style.fontWeight = "bold";
    globalError.style.transition = "all 0.2s";
    globalError.style.transform = "scale(1.08)";
    setTimeout(() => {
      globalError.style.transform = "scale(1)";
    }, 200);
  }
  function clearGlobalError() {
    if (!globalError) return;
    globalError.textContent = "";
    globalError.classList.add("hidden");
    globalError.style.color = "";
    globalError.style.fontWeight = "";
    globalError.style.transform = "";
  }

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    clearError(errEmail);
    clearError(errPass);
    clearGlobalError();

    let valid = true;
    if (!emailInput.value.trim()) {
      showError(errEmail, "Vui lòng nhập email");
      valid = false;
    }
    if (!passwordInput.value.trim()) {
      showError(errPass, "Vui lòng nhập mật khẩu");
      valid = false;
    }
    if (!valid) {
      showGlobalError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: emailInput.value.trim(),
          password: passwordInput.value.trim()
        })
      });
      let data = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) {
        showError(errPass, data.message || "Sai tài khoản hoặc mật khẩu");
        showGlobalError(data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }
      // Thành công
      window.location.href = "/pages/user/homePage.html";
    } catch (err) {
      showError(errPass, "Không thể kết nối tới server!");
      showGlobalError("Không thể kết nối tới server!");
    }
  });
});
