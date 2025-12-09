const API_URL = "http://localhost:3000/api"; // Base URL

// Form validation and submission
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Lấy giá trị từ form
    const displayName = document.getElementById("displayName").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Reset tất cả error messages
    clearAllErrors();

    // Client-side validation
    let hasError = false;

    // Validate displayName
    if (!displayName) {
      showError("displayName", "Vui lòng nhập họ và tên");
      hasError = true;
    }

    // Validate username
    if (!username) {
      showError("username", "Vui lòng nhập tên đăng nhập");
      hasError = true;
    } else if (username.length < 3) {
      showError("username", "Tên đăng nhập phải có ít nhất 3 ký tự");
      hasError = true;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError("email", "Vui lòng nhập email");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      showError("email", "Email không hợp lệ");
      hasError = true;
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone) {
      showError("phone", "Vui lòng nhập số điện thoại");
      hasError = true;
    } else if (!phoneRegex.test(phone)) {
      showError("phone", "Số điện thoại phải có 10-11 chữ số");
      hasError = true;
    }

    // Validate password
    if (!password) {
      showError("password", "Vui lòng nhập mật khẩu");
      hasError = true;
    } else if (password.length < 6) {
      showError("password", "Mật khẩu phải có ít nhất 6 ký tự");
      hasError = true;
    }

    // Validate confirm password
    if (!confirmPassword) {
      showError("confirmPassword", "Vui lòng xác nhận mật khẩu");
      hasError = true;
    } else if (password !== confirmPassword) {
      showError("confirmPassword", "Mật khẩu không khớp");
      hasError = true;
    }

    if (hasError) return;

    // Disable submit button
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Đang xử lý...";

    try {
      console.log("Đang gửi request đến:", `${API_URL}/auth/signup`);
      console.log("Data:", { username, email, displayName, phone });

      // Gọi API đăng ký
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors", // Explicitly set CORS mode
        body: JSON.stringify({
          username,
          password,
          email,
          displayName,
          phone,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Xử lý response theo controller
      if (response.status === 204 || response.ok) {
        // Đăng ký thành công (204 No Content)
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        window.location.href = "/signin.html";
      } else if (response.status === 409) {
        // Username đã tồn tại
        try {
          const data = await response.json();
          showError("username", data.message || "Username đã tồn tại");
        } catch (e) {
          showError("username", "Username đã tồn tại");
        }
      } else if (response.status === 400) {
        // Thiếu thông tin
        try {
          const data = await response.json();
          alert(data.message || "Vui lòng điền đầy đủ thông tin");
        } catch (e) {
          alert("Vui lòng điền đầy đủ thông tin");
        }
      } else if (response.status === 500) {
        // Lỗi hệ thống
        try {
          const data = await response.json();
          alert(data.message || "Lỗi hệ thống, vui lòng thử lại sau");
        } catch (e) {
          alert("Lỗi hệ thống, vui lòng thử lại sau");
        }
      } else {
        // Lỗi khác
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Đăng ký thất bại (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Xử lý lỗi chi tiết hơn
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        alert(
          "Không thể kết nối đến server!\n\nVui lòng kiểm tra:\n1. Backend đang chạy tại " +
            API_URL +
            "\n2. CORS đã được cấu hình đúng\n3. URL API chính xác"
        );
      } else {
        alert("Lỗi: " + error.message);
      }
    } finally {
      // Enable submit button again
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
