const API_URL = "/api/account";

// --- Lấy tất cả user ---
export async function getAllUsersApi(token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/allUser`, { headers });
        if (!res.ok) throw new Error("Lấy danh sách user thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { users: [] };
    }
}

// --- Lấy enum roles ---
export async function getUserRolesApi(token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/enum/roles`, { headers });
        if (!res.ok) throw new Error("Lấy roles thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { roles: ["Admin", "Receptionist", "User"] };
    }
}

// --- Thêm user (đăng ký) ---
// Note: project uses /api/auth/signup for creating accounts; keep it here for convenience
export async function addUserApi(user, token) {
    try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`/api/auth/signup`, {
            method: "POST",
            headers,
            body: JSON.stringify(user)
        });
        if (!res.ok) throw new Error("Thêm user thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Sửa user ---
export async function updateUserApi(id, updatedUser, token) {
    try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(updatedUser)
        });
        if (!res.ok) throw new Error("Cập nhật user thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Xóa user ---
export async function deleteUserApi(id, token) {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers
        });
        if (!res.ok) throw new Error("Xóa user thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}
