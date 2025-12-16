// auth.js - Xử lý API cho đăng nhập, đăng ký, quên mật khẩu, reset password

const API_BASE = 'http://localhost:3000/api/auth';

export async function signIn({ email, password }) {
  const res = await fetch(`${API_BASE}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Đăng nhập thất bại');
  return await res.json();
}

export async function signUp({ name, email, password, phone, cccd, address, role }) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone, cccd, address, role })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Đăng ký thất bại');
  return await res.json();
}

export async function forgotPassword({ email }) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Gửi email thất bại');
  return await res.json();
}

export async function resetPassword({ email, token, newPassword }) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, newPassword })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Đặt lại mật khẩu thất bại');
  return await res.json();
}
