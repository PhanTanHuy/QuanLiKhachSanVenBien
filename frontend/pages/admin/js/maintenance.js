import { Notify } from "../../../components/notification.js";
import { 
    getAllMaintenancesApi, 
    getMaintenanceByCodeApi,
    completeMaintenanceApi,
    deleteMaintenanceApi 
} from "../../../api/maintenanceApi.js";

let maintenancesData = [];
let currentMaintenance = null;

// DOM Elements
const maintenanceList = document.getElementById("maintenanceList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const detailPopup = document.getElementById("detailPopup");

// --- Render danh sách bảo trì ---
function renderMaintenances(list) {
    maintenanceList.innerHTML = "";
    
    if (list.length === 0) {
        maintenanceList.innerHTML = "<p style='text-align:center; padding:20px;'>Không có lịch bảo trì nào</p>";
        return;
    }

    list.forEach(m => {
        const card = document.createElement("div");
        card.className = "maintenance-card";
        
        const statusClass = m.status === "Đang bảo trì" ? "status-active" : "status-completed";
        const startDate = new Date(m.startDate).toLocaleString("vi-VN");
        const endDate = new Date(m.endDate).toLocaleString("vi-VN");
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${m.maintenanceCode}</h3>
                <span class="status-badge ${statusClass}">${m.status}</span>
            </div>
            <div class="card-body">
                <p><strong>Mã phòng:</strong> ${m.roomSnapshot?.roomCode || m.room?.id || 'N/A'}</p>
                <p><strong>Ngày bắt đầu:</strong> ${startDate}</p>
                <p><strong>Ngày kết thúc:</strong> ${endDate}</p>
                <p><strong>Lý do:</strong> ${m.reason}</p>
            </div>
        `;
        
        card.onclick = () => openDetailPopup(m);
        maintenanceList.appendChild(card);
    });
}

// --- Mở popup chi tiết ---
async function openDetailPopup(maintenance) {
    currentMaintenance = maintenance;
    
    document.getElementById("detailMaintenanceCode").textContent = maintenance.maintenanceCode;
    document.getElementById("detailRoomCode").textContent = maintenance.roomSnapshot?.roomCode || maintenance.room?.id || 'N/A';
    document.getElementById("detailRoomType").textContent = maintenance.roomSnapshot?.roomType || maintenance.room?.type || 'N/A';
    document.getElementById("detailStartDate").textContent = new Date(maintenance.startDate).toLocaleString("vi-VN");
    document.getElementById("detailEndDate").textContent = new Date(maintenance.endDate).toLocaleString("vi-VN");
    document.getElementById("detailReason").textContent = maintenance.reason;
    
    const statusSpan = document.getElementById("detailStatus");
    statusSpan.textContent = maintenance.status;
    statusSpan.className = "status-badge " + (maintenance.status === "Đang bảo trì" ? "status-active" : "status-completed");
    
    document.getElementById("detailCreatedAt").textContent = new Date(maintenance.createdAt).toLocaleString("vi-VN");
    
    // Ẩn nút hoàn thành nếu đã hoàn thành
    const completeBtn = document.getElementById("completeMaintenanceBtn");
    if (maintenance.status === "Hoàn thành") {
        completeBtn.style.display = "none";
    } else {
        completeBtn.style.display = "inline-block";
    }
    
    detailPopup.style.display = "flex";
}

// --- Close popup ---
document.getElementById("closeDetailBtn").onclick = () => {
    detailPopup.style.display = "none";
};

// --- Hoàn thành bảo trì ---
document.getElementById("completeMaintenanceBtn").onclick = async () => {
    if (!currentMaintenance) return;
    
    const confirm = await Notify.confirm(`Xác nhận hoàn thành bảo trì ${currentMaintenance.maintenanceCode}?`);
    if (!confirm) return;
    
    try {
        const result = await completeMaintenanceApi(currentMaintenance.maintenanceCode);
        
        if (result.success) {
            Notify.show("Hoàn thành bảo trì thành công!", "success");
            detailPopup.style.display = "none";
            await loadMaintenances();
        } else {
            Notify.show(result.message || "Hoàn thành bảo trì thất bại!", "error");
        }
    } catch (err) {
        console.error(err);
        Notify.show(err.message || "Hoàn thành bảo trì thất bại!", "error");
    }
};

// --- Xóa lịch bảo trì ---
document.getElementById("deleteMaintenanceBtn").onclick = async () => {
    if (!currentMaintenance) return;
    
    const confirm = await Notify.confirm(`Bạn có chắc muốn xóa lịch bảo trì ${currentMaintenance.maintenanceCode}?`);
    if (!confirm) return;
    
    try {
        const result = await deleteMaintenanceApi(currentMaintenance.maintenanceCode);
        
        if (result.success) {
            Notify.show("Xóa lịch bảo trì thành công!", "success");
            detailPopup.style.display = "none";
            await loadMaintenances();
        } else {
            Notify.show(result.message || "Xóa lịch bảo trì thất bại!", "error");
        }
    } catch (err) {
        console.error(err);
        Notify.show(err.message || "Xóa lịch bảo trì thất bại!", "error");
    }
};

// --- Load danh sách bảo trì ---
async function loadMaintenances(status = null) {
    try {
        const result = await getAllMaintenancesApi(status);
        maintenancesData = result.maintenances || [];
        renderMaintenances(maintenancesData);
    } catch (err) {
        console.error(err);
        Notify.show("Lấy danh sách bảo trì thất bại!", "error");
    }
}

// --- Filter ---
function filterMaintenances() {
    const searchValue = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    
    let filtered = maintenancesData.filter(m => {
        const matchSearch = m.maintenanceCode.toLowerCase().includes(searchValue) || 
                           (m.roomSnapshot?.roomCode || '').toLowerCase().includes(searchValue);
        const matchStatus = !statusValue || m.status === statusValue;
        return matchSearch && matchStatus;
    });
    
    renderMaintenances(filtered);
}

// Event listeners
searchInput.oninput = filterMaintenances;
statusFilter.onchange = filterMaintenances;

// Sắp xếp theo ngày với toggle
let sortDateAsc = true;
const sortByDateBtn = document.getElementById("sortByDateBtn");
sortByDateBtn.onclick = () => {
    sortDateAsc = !sortDateAsc;
    const sorted = [...maintenancesData].sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return sortDateAsc ? dateA - dateB : dateB - dateA;
    });
    sortByDateBtn.textContent = sortDateAsc ? "Ngày ↑" : "Ngày ↓";
    renderMaintenances(sorted);
};

// Init
loadMaintenances();
