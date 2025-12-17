const form = document.getElementById("signInForm");
const globalError = document.getElementById("globalError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // reset lỗi
  globalError.classList.add("hidden");
  globalError.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    globalError.textContent = "Vui lòng nhập đầy đủ email và mật khẩu";
    globalError.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Phản hồi server không hợp lệ");
    }

    if (!res.ok) {
  globalError.textContent = data.message || "Sai email hoặc mật khẩu";
  globalError.classList.remove("hidden");
  return;
}

    // lưu access token
    localStorage.setItem("accessToken", data.accessToken);

    // redirect (tạm thời)
    window.location.href = "/user/home";
  } catch (error) {
    console.error(error);
    globalError.textContent = error.message || "Không thể kết nối server";
    globalError.classList.remove("hidden");
  }
});
