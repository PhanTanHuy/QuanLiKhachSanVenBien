
import { getRoomsApi } from "../../../api/roomApi.js";
import { addRoomApi } from "../../../api/roomApi.js";
import { updateRoomApi } from "../../../api/roomApi.js";
import { deleteRoomApi } from "../../../api/roomApi.js";



// --- Render room list ---
function renderRooms(list) {
    const container = document.getElementById("roomList");
    container.innerHTML = "";

    list.forEach(r => {
        const card = document.createElement("div");
        card.className = "room-card";
        card.dataset.id = r.id; // gắn id phòng
        card.innerHTML = `
            <img src="${r.img}" alt="Phòng ${r.id}">
            <h3>Phòng ${r.id} – ${r.type}</h3>
            <p class="room-description">${r.desc}</p>
            <p>Giá: ${r.price.toLocaleString()} đ</p>
            <p>Trạng thái: ${r.status === "available" ? "Trống" : r.status === "occupied" ? "Đang thuê" : "Đã đặt cọc"}</p>
        `;
        container.appendChild(card);

        // --- Click để chỉnh sửa ---
        card.onclick = () => openEditRoomPopup(r);
    });
}


// --- Render filter dropdown ---
let ROOM_TYPES = [];
let ROOM_STATUSES = [];

async function loadEnums() {
    try {
        const res = await fetch("/api/rooms/enums");
        const data = await res.json();
        ROOM_TYPES = data.types;
        ROOM_STATUSES = data.statuses.map(st => ({
            value: st,
            label: st
        }));

        // Populate dropdowns
        const filterTypeSelect = document.getElementById("filterType");
        ROOM_TYPES.forEach(type => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            filterTypeSelect.appendChild(option);
        });

        const filterStatusSelect = document.getElementById("filterStatus");
        ROOM_STATUSES.forEach(st => {
            const option = document.createElement("option");
            option.value = st.value;
            option.textContent = st.label;
            filterStatusSelect.appendChild(option);
        });

        const newTypeSelect = document.getElementById("newRoomType");
        ROOM_TYPES.forEach(type => {
            const opt = document.createElement("option");
            opt.value = type;
            opt.textContent = type;
            newTypeSelect.appendChild(opt);
        });

        const newStatusSelect = document.getElementById("newRoomStatus");
        ROOM_STATUSES.forEach(st => {
            const opt = document.createElement("option");
            opt.value = st.value;
            opt.textContent = st.label;
            newStatusSelect.appendChild(opt);
        });

    } catch (err) {
        console.error("Lấy enum thất bại", err);
    }
}

loadEnums();


// --- FILTER POPUP ---
const filterPopup = document.getElementById("filterPopup");
document.getElementById("openFilter").onclick = () => filterPopup.style.display = "flex";
document.getElementById("closeFilter").onclick = () => filterPopup.style.display = "none";
// --- ADD ROOM POPUP ---
const addRoomPopup = document.getElementById("addRoomPopup");
document.getElementById("addRoomBtn").onclick = () => addRoomPopup.style.display = "flex";
document.getElementById("closeAddRoom").onclick = () => addRoomPopup.style.display = "none";

// --- MAIN ---
let roomsData = [];
getRoomsApi().then(data => {
    roomsData = data;
    renderRooms(roomsData);
});

// --- SEARCH ---
document.getElementById("searchInput").oninput = (e) => {
    const value = e.target.value.toLowerCase();
    const result = roomsData.filter(r =>
        r.id.toLowerCase().includes(value) ||
        r.type.toLowerCase().includes(value)
    );
    renderRooms(result);
};

// --- FILTER APPLY ---
document.getElementById("applyFilter").onclick = () => {
    const maxPrice = document.getElementById("filterPrice").value;
    const fType = document.getElementById("filterType").value;
    const fStatus = document.getElementById("filterStatus").value;

    let filtered = roomsData.filter(r => {
        return (
            (!maxPrice || r.price <= maxPrice) &&
            (!fType || r.type === fType) &&
            (!fStatus || r.status === fStatus)
        );
    });

    renderRooms(filtered);
    filterPopup.style.display = "none";
};

// --- SORTING ---
document.querySelectorAll(".sort-bar button").forEach(btn => {
    btn.onclick = () => {
        const type = btn.dataset.sort;
        let sorted = [...roomsData];

        if (type === "price") sorted.sort((a, b) => a.price - b.price);
        else if (type === "type") sorted.sort((a, b) => a.type.localeCompare(b.type));
        else if (type === "status") sorted.sort((a, b) => a.status.localeCompare(b.status));

        renderRooms(sorted);
    };
});
// CRUD
document.getElementById("saveNewRoom").onclick = async () => {
    const id = document.getElementById("newRoomId").value.trim();
    const type = document.getElementById("newRoomType").value;
    const price = Number(document.getElementById("newRoomPrice").value);
    const status = document.getElementById("newRoomStatus").value;
    const desc = document.getElementById("newRoomDesc").value;
    const imgFile = document.getElementById("newRoomImg").files[0];

    if (!id || !type || !price || !status || !imgFile) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
        const base64Img = reader.result;
        const newRoom = {
            id,
            type,
            price,
            status,
            img: base64Img,
            desc
        };

        try {
            // gọi API thêm phòng
            await addRoomApi(newRoom);
            // nếu thành công thì update frontend
            roomsData.push(newRoom);
            renderRooms(roomsData);
            addRoomPopup.style.display = "none";
            alert(`Thêm phòng ${id} thành công!`);
        } catch (err) {
            // nếu thất bại thì thông báo lỗi
            console.error(err);
            alert(`Thêm phòng thất bại: ${err.message}`);
        }
    };

    reader.readAsDataURL(imgFile);
};



const uploadArea = document.getElementById("imageUploadArea");
const fileInput = document.getElementById("newRoomImg");
const previewImg = document.getElementById("previewImage");

uploadArea.onclick = () => fileInput.click();

fileInput.onchange = () => showPreview(fileInput.files[0]);

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = e => {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
    };
    reader.readAsDataURL(file);
}

uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", e => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (file) {
        fileInput.files = e.dataTransfer.files;
        showPreview(file);
    }
});
// --- EDIT ROOM
const editRoomPopup = document.getElementById("editRoomPopup");
const editRoomId = document.getElementById("editRoomId");
const editRoomType = document.getElementById("editRoomType");
const editRoomPrice = document.getElementById("editRoomPrice");
const editRoomStatus = document.getElementById("editRoomStatus");
const editRoomDesc = document.getElementById("editRoomDesc");
const editPreviewImage = document.getElementById("editPreviewImage");
const editRoomImg = document.getElementById("editRoomImg");
const editUploadArea = document.getElementById("editImageUploadArea");

let currentEditingRoom = null;

// populate dropdowns
ROOM_TYPES.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    editRoomType.appendChild(opt);
});

ROOM_STATUSES.forEach(st => {
    const opt = document.createElement("option");
    opt.value = st.value;
    opt.textContent = st.label;
    editRoomStatus.appendChild(opt);
});

function openEditRoomPopup(room) {
    currentEditingRoom = room;
    editRoomId.value = room.id;
    editRoomType.value = room.type;
    editRoomPrice.value = room.price;
    editRoomStatus.value = room.status;
    editRoomDesc.value = room.desc;
    editPreviewImage.src = room.img;
    editPreviewImage.style.display = "block";

    editRoomPopup.style.display = "flex";
}

// Đóng popup
document.getElementById("closeEditRoom").onclick = () => editRoomPopup.style.display = "none";
// chon anh chinh sua
editUploadArea.onclick = () => editRoomImg.click();

editRoomImg.onchange = () => {
    const file = editRoomImg.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        editPreviewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

editUploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    editUploadArea.classList.add("dragover");
});

editUploadArea.addEventListener("dragleave", () => {
    editUploadArea.classList.remove("dragover");
});

editUploadArea.addEventListener("drop", e => {
    e.preventDefault();
    editUploadArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (file) {
        editRoomImg.files = e.dataTransfer.files;
        const reader = new FileReader();
        reader.onload = e => {
            editPreviewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
document.getElementById("saveEditRoom").onclick = () => {
    if (!currentEditingRoom) return;

    const type = editRoomType.value;
    const price = Number(editRoomPrice.value);
    const status = editRoomStatus.value;
    const desc = editRoomDesc.value;
    const imgFile = editRoomImg.files[0];

    if (!type || !price || !status) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (imgFile) {
        const reader = new FileReader();
        reader.onload = () => {
            updateRoom(currentEditingRoom, type, price, status, desc, reader.result);
        };
        reader.readAsDataURL(imgFile);
    } else {
        updateRoom(currentEditingRoom, type, price, status, desc, currentEditingRoom.img);
    }
};

function updateRoom(room, type, price, status, desc, img) {
    room.type = type;
    room.price = price;
    room.status = status;
    room.desc = desc;
    room.img = img;

    // gọi API giả
    updateRoomApi(room.id, room).then(() => {
        console.log("Đã cập nhật phòng");
    });

    renderRooms(roomsData);
    editRoomPopup.style.display = "none";
}

// Xóa phòng
document.getElementById("deleteRoomBtn").onclick = () => {
    if (!currentEditingRoom) return;
    const confirmDelete = confirm(`Bạn có chắc muốn xóa phòng ${currentEditingRoom.id} không?`);
    if (!confirmDelete) return;

    // Xóa trong mảng
    roomsData = roomsData.filter(r => r.id !== currentEditingRoom.id);

    // Gọi API giả (có thể thêm hàm deleteRoom trong roomApi.js)
    deleteRoomApi(currentEditingRoom.id).then(() => {
        console.log("Đã xóa phòng");
    });

    renderRooms(roomsData);
    editRoomPopup.style.display = "none";
};



