// logout.js
async function logout() {
  try {
    await fetch('http://localhost:3000/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    });
    // Xoá token localStorage nếu có
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/signin';
  } catch (err) {
    alert('Đăng xuất thất bại!');
  }
}

// Gắn vào icon user hoặc nút đăng xuất
const userIcon = document.querySelector('.user-icon');
if (userIcon) {
  userIcon.style.cursor = 'pointer';
  userIcon.title = 'Đăng xuất';
  userIcon.onclick = logout;
}
