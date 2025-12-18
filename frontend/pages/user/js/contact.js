document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value.trim(),
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      alert(result.message || "Gửi thất bại");
      return;
    }

    // Hiện thông báo thành công
    document.getElementById("successMessage").classList.add("show");
    document.getElementById("contactForm").reset();
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối server");
  }
});
