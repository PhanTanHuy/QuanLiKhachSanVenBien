const accessToken = localStorage.getItem("accessToken");
let userID = "";
console.log("Token:", accessToken);

async function getProfile() {
  try {
    const response = await fetch("/api/users/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const data = await response.json();

    userID = data.user._id;

    console.log("User:", data.user);
    if (data.user) {
      document.getElementById("name").value = data.user.name;
      document.getElementById("email").value = data.user.email;
      document.getElementById("address").value = data.user.address;
      document.getElementById("phone").value = data.user.phone;
      document.getElementById("cccd").value = data.user.cccd;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}

function AllowUpdate() {
  document.getElementById("saveBtn").disabled = false;
  document.getElementById("name").disabled = false;
  document.getElementById("email").disabled = false;
  document.getElementById("address").disabled = false;
  document.getElementById("phone").disabled = false;
  document.getElementById("cccd").disabled = false;
  document.getElementById("password").disabled = false;
}

function SaveProfile() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const cccd = document.getElementById("cccd").value;
  const password = document.getElementById("password").value;
  console.log(userID);

  console.log("Updating profile for user ID:", userID);
  fetch(`/api/account/${userID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      address,
      phone,
      cccd,
      password
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    else {
        alert("Cập nhật hồ sơ thành công!");
        document.getElementById("saveBtn").disabled = true;
        document.getElementById("name").disabled = true;
        document.getElementById("email").disabled = true;
        document.getElementById("address").disabled = true;
        document.getElementById("phone").disabled = true;
        document.getElementById("cccd").disabled = true;
        document.getElementById("password").disabled = true;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getProfile();
});
