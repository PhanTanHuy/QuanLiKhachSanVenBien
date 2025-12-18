// rooms.js
import { Notify } from "../../../components/notification.js"; // đường dẫn tới notification.js
import { getRoomsApi, addRoomApi, updateRoomApi, deleteRoomApi } from "../../../api/roomApi.js";
import { createMaintenanceApi, getMaintenancesByRoomApi } from "../../../api/maintenanceApi.js";

let roomsData = [];
let ROOM_TYPES = [];
let ROOM_STATUSES = [];
let currentEditingRoom = null;
let currentMaintenanceRoom = null;

// --- DOM ELEMENTS ---
const roomList = document.getElementById("roomList");

// FILTER POPUP
const filterTypeSelect = document.getElementById("filterType");
const filterStatusSelect = document.getElementById("filterStatus");
const filterPriceInput = document.getElementById("filterPrice");

// ADD ROOM POPUP
const addRoomPopup = document.getElementById("addRoomPopup");
const addRoomBtn = document.getElementById("addRoomBtn");
addRoomBtn.onclick = () => addRoomPopup.style.display = "flex";
document.getElementById("closeAddRoom").onclick = () => addRoomPopup.style.display = "none";

// EDIT ROOM POPUP
const editRoomPopup = document.getElementById("editRoomPopup");
const editRoomId = document.getElementById("editRoomId");
const editRoomType = document.getElementById("editRoomType");
const editRoomPrice = document.getElementById("editRoomPrice");
const editRoomStatus = document.getElementById("editRoomStatus");
const editRoomDesc = document.getElementById("editRoomDesc");
const editPreviewImage = document.getElementById("editPreviewImage");
const editRoomImg = document.getElementById("editRoomImg");
const editUploadArea = document.getElementById("editImageUploadArea");

document.getElementById("closeEditRoom").onclick = () => editRoomPopup.style.display = "none";

// --- UTILS ---
function createOption(value, label) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label ?? value;
    return opt;
}

function renderRooms(list) {
    roomList.innerHTML = "";
    list.forEach(r => {
        const card = document.createElement("div");
        card.className = "room-card";
        
        // Thêm class maintenance nếu phòng đang bảo trì
        if (r.status === "Đang bảo trì") {
            card.className += " maintenance";
        }
        
        card.dataset.id = r.id;
        
        // Thêm nút bảo trì cho phòng trống
        const maintenanceBtn = r.status === "Trống" 
            ? `<button class="maintenance-btn" onclick="event.stopPropagation(); openMaintenancePopup('${r.id}', '${r._id}')">🔧 Bảo trì</button>`
            : '';
        
        card.innerHTML = `
            <img src="${r.img}" alt="Phòng ${r.id}">
            <h3>Phòng ${r.id} – ${r.type}</h3>
            <p class="room-description">${r.desc}</p>
            <p>Giá: ${r.price.toLocaleString()} đ</p>
            <p>Trạng thái: ${r.status}</p>
            ${maintenanceBtn}
        `;
        card.onclick = () => openEditRoomPopup(r);
        roomList.appendChild(card);
    });
}

// --- LOAD ENUMS ---
async function loadEnums() {
    try {
        const res = await fetch("/api/rooms/enums");
        const data = await res.json();
        ROOM_TYPES = data.types;
        ROOM_STATUSES = data.statuses.map(st => ({ value: st, label: st }));

        // Populate dropdowns
        const newTypeSelect = document.getElementById("newRoomType");
        const newStatusSelect = document.getElementById("newRoomStatus");
        const typeFilterSelect = document.getElementById("typeFilter");
        const statusFilterSelect = document.getElementById("statusFilter");
        
        // Populate filter selects
        typeFilterSelect.innerHTML = "<option value=''>Tất cả loại phòng</option>";
        statusFilterSelect.innerHTML = "<option value=''>Tất cả tình trạng</option>";
        
        newTypeSelect.innerHTML = "<option value=''>Chọn loại phòng</option>";
        newStatusSelect.innerHTML = "<option value=''>Chọn tình trạng</option>";
        
        editRoomType.innerHTML = "";
        editRoomStatus.innerHTML = "";

        ROOM_TYPES.forEach(type => {
            const opt1 = createOption(type);
            const opt2 = createOption(type);
            const opt3 = createOption(type);
            typeFilterSelect.appendChild(opt1);
            newTypeSelect.appendChild(opt2);
            editRoomType.appendChild(opt3);
        });

        ROOM_STATUSES.forEach(st => {
            const opt1 = createOption(st.value, st.label);
            const opt2 = createOption(st.value, st.label);
            const opt3 = createOption(st.value, st.label);
            statusFilterSelect.appendChild(opt1);
            newStatusSelect.appendChild(opt2);
            editRoomStatus.appendChild(opt3);
        });

        // Add filter event listeners
        document.getElementById("typeFilter").onchange = () => filterRooms();
        document.getElementById("statusFilter").onchange = () => filterRooms();
    } catch (err) {
        console.error("Lấy enum thất bại", err);
    }
}

// --- FILTER FUNCTION ---
function filterRooms() {
    const typeFilter = document.getElementById("typeFilter").value;
    const statusFilter = document.getElementById("statusFilter").value;
    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    const filtered = roomsData.filter(r => {
        const matchType = !typeFilter || r.type === typeFilter;
        const matchStatus = !statusFilter || r.status === statusFilter;
        const matchSearch = r.id.toLowerCase().includes(searchValue) || r.type.toLowerCase().includes(searchValue);
        return matchType && matchStatus && matchSearch;
    });

    renderRooms(filtered);
}

// --- INITIAL LOAD ---
async function init() {
    await loadEnums();
    roomsData = await getRoomsApi();
    renderRooms(roomsData);
}

init();

// --- SEARCH ---
document.getElementById("searchInput").oninput = () => filterRooms();

// --- SORTING ---
let sortStates = {};

document.querySelectorAll(".sort-bar button").forEach(btn => {
    const sortType = btn.dataset.sort;
    if (sortType) {
        sortStates[sortType] = true; // true = ascending, false = descending
    }
    
    btn.onclick = () => {
        const type = btn.dataset.sort;
        if (!type) return;
        
        // Toggle sort direction
        sortStates[type] = !sortStates[type];
        const isAsc = sortStates[type];
        
        const sorted = [...roomsData];
        if (type === "price") {
            sorted.sort((a, b) => isAsc ? a.price - b.price : b.price - a.price);
            btn.textContent = isAsc ? "Giá ↑" : "Giá ↓";
        } else if (type === "type") {
            sorted.sort((a, b) => isAsc ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type));
            btn.textContent = isAsc ? "Loại ↑" : "Loại ↓";
        } else if (type === "status") {
            sorted.sort((a, b) => isAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
            btn.textContent = isAsc ? "Trạng thái ↑" : "Trạng thái ↓";
        }
        
        renderRooms(sorted);
    };
});

// --- IMAGE UPLOAD PREVIEW UTILS ---
function setupImageUpload(input, previewImg, area) {
    area.onclick = () => input.click();

    input.onchange = () => showPreview(input.files[0], previewImg);

    area.addEventListener("dragover", e => {
        e.preventDefault();
        area.classList.add("dragover");
    });

    area.addEventListener("dragleave", e => {
        e.preventDefault();
        area.classList.remove("dragover");
    });

    area.addEventListener("drop", e => {
        e.preventDefault();
        area.classList.remove("dragover");

        const file = e.dataTransfer.files[0];
        if (file) {
            showPreview(file, previewImg);
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
        }
    });
}


function showPreview(file, img) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        img.src = e.target.result;
        img.style.display = "block";
    };
    reader.readAsDataURL(file);
}


// --- ADD ROOM ---
setupImageUpload(document.getElementById("newRoomImg"), document.getElementById("previewImage"), document.getElementById("imageUploadArea"));

document.getElementById("saveNewRoom").onclick = async () => {
    const id = document.getElementById("newRoomId").value.trim();
    const type = document.getElementById("newRoomType").value;
    const price = Number(document.getElementById("newRoomPrice").value);
    const status = document.getElementById("newRoomStatus").value;
    const desc = document.getElementById("newRoomDesc").value;
    const imgFile = document.getElementById("newRoomImg").files[0];

    if (!id || !type || !price || !status || !imgFile) {
        return Notify.show("Vui lòng nhập đầy đủ thông tin!", "error");
    }

    const reader = new FileReader();
    reader.onload = async () => {
        try {
            const newRoom = { id, type, price, status, desc, img: reader.result };
            await addRoomApi(newRoom); // nếu lỗi, sẽ vào catch này
            roomsData.push(newRoom);
            renderRooms(roomsData);
            addRoomPopup.style.display = "none";
            Notify.show(`Thêm phòng ${id} thành công!`, "success");
        } catch (err) {
            console.error(err);
            Notify.show("Thêm phòng thất bại!", "error");
        }
    };
    reader.readAsDataURL(imgFile);
};



// --- EDIT ROOM ---
setupImageUpload(editRoomImg, editPreviewImage, editUploadArea);

async function openEditRoomPopup(room) {
    
    // Disable trạng thái - chỉ có thể xem
    editRoomStatus.disabled = true;
    
    currentEditingRoom = room;
    editRoomId.value = room.id;
    editRoomType.value = room.type;
    editRoomPrice.value = room.price;
    editRoomStatus.value = room.status;
    editRoomDesc.value = room.desc;
    editPreviewImage.src = room.img;
    
    // Disable trạng thái - chỉ có thể xem
    editRoomStatus.disabled = true;
    
    // Kiểm tra nếu phòng đang bảo trì, lấy mã bảo trì
    const maintenanceCodeField = document.getElementById("editMaintenanceCode");
    const maintenanceCodeRow = document.getElementById("maintenanceCodeRow");
    
    if (room.status === "Đang bảo trì") {
        try {
            const result = await getMaintenancesByRoomApi(room._id);
            if (result.success && result.maintenances && result.maintenances.length > 0) {
                // Tìm bảo trì đang hoạt động
                const activeMaintenance = result.maintenances.find(m => m.status === "Đang bảo trì");
                if (activeMaintenance) {
                    maintenanceCodeField.value = activeMaintenance.maintenanceCode;
                    maintenanceCodeRow.style.display = "block";
                } else {
                    maintenanceCodeRow.style.display = "none";
                }
            } else {
                maintenanceCodeRow.style.display = "none";
            }
        } catch (err) {
            console.error("Lỗi khi lấy mã bảo trì:", err);
            maintenanceCodeRow.style.display = "none";
        }
    } else {
        maintenanceCodeRow.style.display = "none";
    }
    
    editRoomPopup.style.display = "flex";
}

document.getElementById("saveEditRoom").onclick = async () => {
    if (!currentEditingRoom) return;
    const type = editRoomType.value;
    const price = Number(editRoomPrice.value);
    const desc = editRoomDesc.value;
    const img = editRoomImg.files[0] ? editPreviewImage.src : currentEditingRoom.img;

    // Không cho phép cập nhật status
    const updatedRoom = { ...currentEditingRoom, type, price, desc, img };
    try {
        await updateRoomApi(currentEditingRoom.id, updatedRoom);
        roomsData = roomsData.map(r => r.id === updatedRoom.id ? updatedRoom : r);
        renderRooms(roomsData);
        editRoomPopup.style.display = "none";
        Notify.show(`Cập nhật phòng ${updatedRoom.id} thành công!`, "success");
    } catch (err) {
        Notify.show(`Cập nhật phòng ${updatedRoom.id} thất bại!`, "error");
        console.error(err);
    }
};


// --- DELETE ROOM ---
document.getElementById("deleteRoomBtn").onclick = async () => {
    if (!currentEditingRoom) return;
    const confirmDelete = await Notify.confirm(`Bạn có chắc muốn xóa phòng ${currentEditingRoom.id}?`);
    if (!confirmDelete) return;

    try {
        await deleteRoomApi(currentEditingRoom.id);
        roomsData = roomsData.filter(r => r.id !== currentEditingRoom.id);
        renderRooms(roomsData);
        editRoomPopup.style.display = "none";
        Notify.show(`Xóa phòng ${currentEditingRoom.id} thành công!`, "success");
    } catch (err) {
        Notify.show(`Xóa phòng ${currentEditingRoom.id} thất bại!`, "error");
        console.error(err);
    }
};

// --- MAINTENANCE POPUP ---
const maintenancePopup = document.getElementById("maintenancePopup");
const maintenanceRoomCode = document.getElementById("maintenanceRoomCode");
const maintenanceStartDate = document.getElementById("maintenanceStartDate");
const maintenanceEndDate = document.getElementById("maintenanceEndDate");
const maintenanceReason = document.getElementById("maintenanceReason");

// Hàm mở popup bảo trì (gọi từ inline onclick trong renderRooms)
window.openMaintenancePopup = function(roomCode, roomId) {
    currentMaintenanceRoom = { roomCode, roomId };
    maintenanceRoomCode.value = roomCode;
    
    // Set giá trị mặc định cho ngày
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    maintenanceStartDate.value = now.toISOString().slice(0, 16);
    maintenanceEndDate.value = tomorrow.toISOString().slice(0, 16);
    maintenanceReason.value = "";
    
    maintenancePopup.style.display = "flex";
};

document.getElementById("closeMaintenanceBtn").onclick = () => {
    maintenancePopup.style.display = "none";
};

document.getElementById("saveMaintenanceBtn").onclick = async () => {
    if (!currentMaintenanceRoom) return;
    
    const startDate = maintenanceStartDate.value;
    const endDate = maintenanceEndDate.value;
    const reason = maintenanceReason.value.trim();
    
    if (!startDate || !endDate || !reason) {
        return Notify.show("Vui lòng nhập đầy đủ thông tin!", "error");
    }
    
    if (new Date(endDate) <= new Date(startDate)) {
        return Notify.show("Ngày kết thúc phải sau ngày bắt đầu!", "error");
    }
    
    try {
        const maintenanceData = {
            roomId: currentMaintenanceRoom.roomId,
            startDate,
            endDate,
            reason
        };
        
        const result = await createMaintenanceApi(maintenanceData);
        
        if (result.success) {
            Notify.show(`Tạo lịch bảo trì cho phòng ${currentMaintenanceRoom.roomCode} thành công!`, "success");
            maintenancePopup.style.display = "none";
            
            // Reload lại danh sách phòng để cập nhật trạng thái
            roomsData = await getRoomsApi();
            renderRooms(roomsData);
        } else {
            Notify.show(result.message || "Tạo lịch bảo trì thất bại!", "error");
        }
    } catch (err) {
        console.error(err);
        Notify.show(err.message || "Tạo lịch bảo trì thất bại!", "error");
    }
};
