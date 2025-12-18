const API_URL = "/api/maintenances";

// --- Tạo lịch bảo trì mới ---
export async function createMaintenanceApi(maintenanceData) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(maintenanceData)
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Tạo lịch bảo trì thất bại");
        }
        
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Lấy tất cả lịch bảo trì ---
export async function getAllMaintenancesApi(status = null) {
    try {
        const url = status ? `${API_URL}?status=${encodeURIComponent(status)}` : API_URL;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Lấy danh sách bảo trì thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { maintenances: [] };
    }
}

// --- Lấy lịch bảo trì theo mã ---
export async function getMaintenanceByCodeApi(code) {
    try {
        const res = await fetch(`${API_URL}/${code}`);
        if (!res.ok) throw new Error("Lấy lịch bảo trì thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Lấy lịch bảo trì theo phòng (roomId hoặc roomCode) ---
export async function getMaintenancesByRoomApi(roomIdentifier) {
    try {
        const res = await fetch(`${API_URL}/by-room/${roomIdentifier}`);
        if (!res.ok) throw new Error("Lấy lịch bảo trì theo phòng thất bại");
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Hoàn thành bảo trì ---
export async function completeMaintenanceApi(code) {
    try {
        const res = await fetch(`${API_URL}/${code}/complete`, {
            method: "PATCH"
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Hoàn thành bảo trì thất bại");
        }
        
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Cập nhật lịch bảo trì ---
export async function updateMaintenanceApi(code, maintenanceData) {
    try {
        const res = await fetch(`${API_URL}/${code}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(maintenanceData)
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Cập nhật lịch bảo trì thất bại");
        }
        
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// --- Xóa lịch bảo trì ---
export async function deleteMaintenanceApi(code) {
    try {
        const res = await fetch(`${API_URL}/${code}`, {
            method: "DELETE"
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Xóa lịch bảo trì thất bại");
        }
        
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}
