// rooms.js
import { Notify } from "../../../components/notification.js"; // đường dẫn tới notification.js
import { getRoomsApi, addRoomApi, updateRoomApi, deleteRoomApi } from "../../../api/roomApi.js";

let roomsData = [];
let ROOM_TYPES = [];
let ROOM_STATUSES = [];
let currentEditingRoom = null;

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
        card.dataset.id = r.id;
        card.innerHTML = `
            <img src="${r.img}" alt="Phòng ${r.id}">
            <h3>Phòng ${r.id} – ${r.type}</h3>
            <p class="room-description">${r.desc}</p>
            <p>Giá: ${r.price.toLocaleString()} đ</p>
            <p>Trạng thái: ${r.status}</p>
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
document.querySelectorAll(".sort-bar button").forEach(btn => {
    btn.onclick = () => {
        const type = btn.dataset.sort;
        const sorted = [...roomsData];
        if (type === "price") sorted.sort((a,b) => a.price - b.price);
        else if (type === "type") sorted.sort((a,b) => a.type.localeCompare(b.type));
        else if (type === "status") sorted.sort((a,b) => a.status.localeCompare(b.status));
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

function openEditRoomPopup(room) {
    currentEditingRoom = room;
    editRoomId.value = room.id;
    editRoomType.value = room.type;
    editRoomPrice.value = room.price;
    editRoomStatus.value = room.status;
    editRoomDesc.value = room.desc;
    editPreviewImage.src = room.img;
    editRoomPopup.style.display = "flex";
}

document.getElementById("saveEditRoom").onclick = async () => {
    if (!currentEditingRoom) return;
    const type = editRoomType.value;
    const price = Number(editRoomPrice.value);
    const status = editRoomStatus.value;
    const desc = editRoomDesc.value;
    const img = editRoomImg.files[0] ? editPreviewImage.src : currentEditingRoom.img;

    const updatedRoom = { ...currentEditingRoom, type, price, status, desc, img };
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

