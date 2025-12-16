// Dùng cho signup.html, signin.html, forgot/reset pages
const API_PREFIX = '/api/auth';

export async function apiPost(path, body) {
  const res = await fetch(`${API_PREFIX}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi mạng');
  return data;
}

export async function register(form) {
  return apiPost('/register', form);
}

export async function login({ email, password }) {
  return apiPost('/login', { email, password });
}

export async function forgotPassword({ email }) {
  return apiPost('/forgot-password', { email });
}

export async function resetPassword({ email, token, newPassword }) {
  return apiPost('/reset-password', { email, token, newPassword });
}

// token helpers
export function saveTokens({ accessToken, refreshToken }) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getAccessToken() { return localStorage.getItem('accessToken'); }
export function getRefreshToken() { return localStorage.getItem('refreshToken'); }

// redirect theo role (input: user object returned by login)
export function redirectByRole(user) {
  if (!user || !user.role) return window.location.href = '/';
  if (user.role === 'ADMIN') window.location.href = '/pages/admin/rooms.html';
  else if (user.role === 'RECEPTIONIST' || user.role === 'RECEPTIONIST') window.location.href = '/receptionist';
  else window.location.href = '/';
}