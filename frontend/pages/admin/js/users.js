// users.js
import { Notify } from "../../../components/notification.js";
import { getAllUsersApi, getUserRolesApi, addUserApi, updateUserApi, deleteUserApi } from "../../../api/accountApi.js";

let usersData = [];
let USER_ROLES = [];
let currentEditingUser = null;

// --- DOM ELEMENTS ---
const userList = document.getElementById("userList");

// ADD USER POPUP
const addUserPopup = document.getElementById("addUserPopup");
const addUserBtn = document.getElementById("addUserBtn");
addUserBtn.onclick = () => addUserPopup.style.display = "flex";
document.getElementById("closeAddUser").onclick = () => addUserPopup.style.display = "none";

// EDIT USER POPUP
const editUserPopup = document.getElementById("editUserPopup");
const editUserId = document.getElementById("editUserId");
const editUserName = document.getElementById("editUserName");
const editUserEmail = document.getElementById("editUserEmail");
const editUserPhone = document.getElementById("editUserPhone");
const editUserAddress = document.getElementById("editUserAddress");
const editUserCccd = document.getElementById("editUserCccd");
const editUserRole = document.getElementById("editUserRole");
const editUserCreatedAt = document.getElementById("editUserCreatedAt");

document.getElementById("closeEditUser").onclick = () => editUserPopup.style.display = "none";

// --- UTILS ---
function createOption(value, label) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label ?? value;
    return opt;
}

function renderUsers(list) {
    userList.innerHTML = "";
    list.forEach(u => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.dataset.id = u._id;
        card.innerHTML = `
            <div class="user-card-header">
                <h3>${u.name}</h3>
                <span class="role-badge" style="background-color: ${getRoleColor(u.role)}">${u.role}</span>
            </div>
            <div class="user-card-info">
                <p class="user-email"><i class="fa-solid fa-envelope"></i> ${u.email}</p>
                <p class="user-phone"><i class="fa-solid fa-phone"></i> ${u.phone}</p>
                <p class="user-address"><i class="fa-solid fa-map-location-dot"></i> ${u.address || "Chưa cập nhật"}</p>
            </div>
        `;
        card.onclick = () => openEditUserPopup(u);
        userList.appendChild(card);
    });
}

function getRoleColor(role) {
    switch (role) {
        case "Admin": return "#ff914d";
        case "Receptionist": return "#5A3300";
        case "User": return "#4CAF50";
        default: return "#999";
    }
}

// --- FETCH USERS ---
async function fetchUsers() {
    try {
        const token = localStorage.getItem("accessToken");
        const data = await getAllUsersApi(token);
        usersData = data.users || [];
        renderUsers(usersData);
    } catch (err) {
        console.error("Lỗi khi fetch users:", err);
        Notify.show("Lỗi khi tải danh sách user", "error");
    }
}

// --- LOAD USER ROLES ---
async function loadUserRoles() {
    try {
        // Lấy enum từ backend
        const token = localStorage.getItem("accessToken");
        const data = await getUserRolesApi(token);
        USER_ROLES = data.roles || ["Admin", "Receptionist", "User"];

        const newRoleSelect = document.getElementById("newUserRole");
        const roleFilterSelect = document.getElementById("roleFilter");
        const editRoleSelect = document.getElementById("editUserRole");
        const popupFilterSelect = document.getElementById("filterRole");

        // Populate select dropdowns (defensive: only operate on existing elements)
        if (newRoleSelect) newRoleSelect.innerHTML = "";
        else console.warn("newUserRole select not found in DOM");

        if (roleFilterSelect) roleFilterSelect.innerHTML = "<option value=''>-- Tất cả vai trò --</option>";
        else console.warn("roleFilter select not found in DOM");

        if (editRoleSelect) editRoleSelect.innerHTML = "";
        else console.warn("editUserRole select not found in DOM");

        if (popupFilterSelect) popupFilterSelect.innerHTML = "<option value=''>-- Tất cả --</option>";
        else console.warn("filterRole select not found in DOM");

        USER_ROLES.forEach(role => {
            const opt1 = createOption(role);
            const opt2 = createOption(role);
            const opt3 = createOption(role);
            const opt4 = createOption(role);

            if (newRoleSelect) newRoleSelect.appendChild(opt1);
            if (roleFilterSelect) roleFilterSelect.appendChild(opt2);
            if (editRoleSelect) editRoleSelect.appendChild(opt3);
            if (popupFilterSelect) popupFilterSelect.appendChild(opt4);
        });
    } catch (err) {
        console.error("Lỗi khi load user roles:", err);
        // Fallback
        USER_ROLES = ["Admin", "Receptionist", "User"];
    }
}

// --- SEARCH & FILTER ---
function filterUsers() {
    const nameFilter = document.getElementById("searchInput").value.toLowerCase();
    const roleFilter = document.getElementById("roleFilter").value;

    const filtered = usersData.filter(u => {
        const matchName = u.name.toLowerCase().includes(nameFilter);
        const matchRole = !roleFilter || u.role === roleFilter;
        return matchName && matchRole;
    });

    renderUsers(filtered);
}

document.getElementById("searchInput").oninput = () => filterUsers();
document.getElementById("roleFilter").onchange = () => filterUsers();

// --- SORT ---
document.querySelectorAll(".sort-bar button").forEach(btn => {
    btn.addEventListener("click", function () {
        const sortType = this.dataset.sort;
        usersData.sort((a, b) => {
            const aVal = a[sortType] || "";
            const bVal = b[sortType] || "";
            return aVal.toString().localeCompare(bVal.toString());
        });
        renderUsers(usersData);
    });
});

// --- ADD USER ---
document.getElementById("saveNewUser").onclick = async () => {
    const name = document.getElementById("newUserName").value.trim();
    const email = document.getElementById("newUserEmail").value.trim();
    const phone = document.getElementById("newUserPhone").value.trim();
    const address = document.getElementById("newUserAddress").value.trim();
    const cccd = document.getElementById("newUserCccd").value.trim();
    const password = document.getElementById("newUserPassword").value.trim();
    const role = document.getElementById("newUserRole").value;

    if (!name || !email || !phone || !password || !role) {
        Notify.show("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
        return;
    }

    try {
        const token = localStorage.getItem("accessToken");
        await addUserApi({ name, email, phone, address, cccd, password, role }, token);

        Notify.show("Thêm user thành công", "success");
        addUserPopup.style.display = "none";
        document.getElementById("newUserName").value = "";
        document.getElementById("newUserEmail").value = "";
        document.getElementById("newUserPhone").value = "";
        document.getElementById("newUserAddress").value = "";
        document.getElementById("newUserCccd").value = "";
        document.getElementById("newUserPassword").value = "";
        document.getElementById("newUserRole").value = "";

        fetchUsers();
    } catch (err) {
        console.error("Lỗi khi thêm user:", err);
        Notify.show("Lỗi khi thêm user", "error");
    }
};

// --- EDIT USER POPUP ---
async function openEditUserPopup(user) {
    currentEditingUser = user;
    editUserId.value = user._id;
    editUserName.value = user.name;
    editUserEmail.value = user.email;
    editUserPhone.value = user.phone;
    editUserAddress.value = user.address || "";
    editUserCccd.value = user.cccd || "";
    editUserRole.value = user.role;
    editUserCreatedAt.value = new Date(user.createdAt).toLocaleString("vi-VN");
    editUserPopup.style.display = "flex";
}

// --- UPDATE USER ---
document.getElementById("saveEditUser").onclick = async () => {
    if (!currentEditingUser) return;

    const name = editUserName.value.trim();
    const phone = editUserPhone.value.trim();
    const address = editUserAddress.value.trim();
    const cccd = editUserCccd.value.trim();
    const role = editUserRole.value;

    if (!name || !phone || !role) {
        Notify.show("Vui lòng điền đầy đủ thông tin", "error");
        return;
    }

    try {
        const token = localStorage.getItem("accessToken");
        await updateUserApi(currentEditingUser._id, { name, phone, address, cccd, role }, token);

        Notify.show("Cập nhật user thành công", "success");
        editUserPopup.style.display = "none";
        fetchUsers();
    } catch (err) {
        console.error("Lỗi khi cập nhật user:", err);
        Notify.show("Lỗi khi cập nhật user", "error");
    }
};

// --- DELETE USER ---
document.getElementById("deleteUserBtn").onclick = async () => {
    if (!currentEditingUser) return;
    try {
        const token = localStorage.getItem("accessToken");
        await deleteUserApi(currentEditingUser._id, token);

        Notify.show("Xóa user thành công", "success");
        editUserPopup.style.display = "none";
        fetchUsers();
    } catch (err) {
        console.error("Lỗi khi xóa user:", err);
        Notify.show("Lỗi khi xóa user", "error");
    }
};

// --- INITIAL LOAD ---
async function init() {
    await loadUserRoles();
    await fetchUsers();
}

init();
