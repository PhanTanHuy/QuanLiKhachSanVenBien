const API_URL = "/api/rooms";

// --- Lấy danh sách phòng ---
export async function getRoomsApi() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Lấy danh sách phòng thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

// --- Thêm phòng ---
export async function addRoomApi(room) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(room)
        });
        if (!res.ok) throw new Error("Thêm phòng thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Sửa phòng ---
export async function updateRoomApi(id, updatedRoom) {
    // try {
    //     const res = await fetch(`${API_URL}/${id}`, {
    //         method: "PUT",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(updatedRoom)
    //     });
    //     if (!res.ok) throw new Error("Cập nhật phòng thất bại");
    //     return await res.json();
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }
}

// --- Xóa phòng ---
export async function deleteRoomApi(id) {
    // try {
    //     const res = await fetch(`${API_URL}/${id}`, {
    //         method: "DELETE"
    //     });
    //     if (!res.ok) throw new Error("Xóa phòng thất bại");
    //     return await res.json();
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }
}

// --- Lấy 1 phòng theo id ---
export async function getRoomByIdApi(id) {
    // try {
    //     const res = await fetch(`${API_URL}/${id}`);
    //     if (!res.ok) throw new Error("Không tìm thấy phòng");
    //     return await res.json();
    // } catch (err) {
    //     console.error(err);
    //     return null;
    // }
}
