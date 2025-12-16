
import { signUp } from '/Auth/auth.js';

document.getElementById("signupForm").addEventListener("submit", async function (e) {

  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const cccd = document.getElementById("cccd")?.value.trim() || "";
  const address = document.getElementById("address")?.value.trim() || "";
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  clearAllErrors();
  let hasError = false;
  if (!name) { showError("name", "Vui lòng nhập họ và tên"); hasError = true; }
  if (!email) { showError("email", "Vui lòng nhập email"); hasError = true; }
  if (!phone) { showError("phone", "Vui lòng nhập số điện thoại"); hasError = true; }
  if (!password) { showError("password", "Vui lòng nhập mật khẩu"); hasError = true; }
  if (!confirmPassword) { showError("confirmPassword", "Vui lòng xác nhận mật khẩu"); hasError = true; }
  if (password !== confirmPassword) { showError("confirmPassword", "Mật khẩu không khớp"); hasError = true; }
  if (hasError) return;

  const submitButton = this.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Đang xử lý...";

  try {
    await signUp({ name, email, password, phone, cccd, address });
    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    window.location.href = "/signin";
  } catch (error) {
    alert(error.message || "Đăng ký thất bại");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

//  show error message
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  if (!input) return;

  const errorElement = input.parentElement.querySelector(".error-message");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Add error class to input
  input.classList.add("error");

  // Remove error when user starts typing
  input.addEventListener("input", function handler() {
    input.classList.remove("error");
    if (errorElement) {
      errorElement.style.display = "none";
    }
    input.removeEventListener("input", handler);
  });
}

// Helper function to clear all errors
function clearAllErrors() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.style.display = "none";
    el.textContent = "";
  });
  document.querySelectorAll(".input-field").forEach((input) => {
    input.classList.remove("error");
  });
}
// Hiển thị lỗi khi submit thiếu thông tin hoặc thông tin không hợp lệ
  document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("signupForm");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const cccd = document.getElementById("cccd");
    const address = document.getElementById("address");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    function showError(input, message) {
      const error = input.parentElement.querySelector(".error-message");
      if (error) {
        error.textContent = message;
        error.style.display = "block";
      }
      input.classList.add("error");
      input.addEventListener("input", function handler() {
        input.classList.remove("error");
        if (error) error.style.display = "none";
        input.removeEventListener("input", handler);
      });
    }

    function clearAllErrors() {
      document.querySelectorAll(".error-message").forEach(el => {
        el.style.display = "none";
        el.textContent = "";
      });
      document.querySelectorAll(".input-field").forEach(input => {
        input.classList.remove("error");
      });
    }

    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      clearAllErrors();
      let hasError = false;
      if (!name.value.trim()) { showError(name, "Vui lòng nhập họ và tên"); hasError = true; }
      if (!email.value.trim()) { showError(email, "Vui lòng nhập email"); hasError = true; }
      if (!phone.value.trim()) { showError(phone, "Vui lòng nhập số điện thoại"); hasError = true; }
      if (!password.value) { showError(password, "Vui lòng nhập mật khẩu"); hasError = true; }
      if (!confirmPassword.value) { showError(confirmPassword, "Vui lòng xác nhận mật khẩu"); hasError = true; }
      if (password.value && confirmPassword.value && password.value !== confirmPassword.value) { showError(confirmPassword, "Mật khẩu không khớp"); hasError = true; }
      if (hasError) return;

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Đang xử lý...";

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            cccd: cccd.value.trim(),
            address: address.value.trim(),
            password: password.value
          })
        });
        if (res.status === 204) {
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          window.location.href = "/signin";
        } else {
          const data = await res.json();
          if (data.message && data.message.includes("email")) showError(email, data.message);
          else if (data.message && data.message.includes("phone")) showError(phone, data.message);
          else alert(data.message || "Đăng ký thất bại");
        }
      } catch (error) {
        alert("Không thể kết nối tới server!");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  });