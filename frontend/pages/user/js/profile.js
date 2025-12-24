document.addEventListener('DOMContentLoaded', () => {
    getUserProfile();

    // Lấy các element
    const btnEdit = document.getElementById('btn-edit');
    const btnSave = document.getElementById('btn-save');
    const btnCancel = document.getElementById('btn-cancel');
    const inputs = document.querySelectorAll('.form-control:not(#email)');

    // --- SỰ KIỆN NÚT BẤM ---

    // Nút Sửa: Mở khóa input, hiện nút Lưu/Hủy
    btnEdit.addEventListener('click', () => {
        inputs.forEach(input => input.disabled = false);
        toggleButtons(true);
    });

    btnCancel.addEventListener('click', () => {
        inputs.forEach(input => input.disabled = true);
        toggleButtons(false);
        getUserProfile(); 
    });

    // Nút Lưu: Gọi API cập nhật
    btnSave.addEventListener('click', async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Phiên đăng nhập hết hạn.");
            window.location.href = "/signin";
            return;
        }

        const updateData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            cccd: document.getElementById('cccd').value,
            address: document.getElementById('address').value
        };

        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('Cập nhật hồ sơ thành công!');
                inputs.forEach(input => input.disabled = true);
                toggleButtons(false);
            } else {
                // Nếu token hết hạn hoặc không hợp lệ
                if (res.status === 401 || res.status === 403) {
                    alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                    localStorage.removeItem("accessToken");
                    window.location.href = "/signin";
                } else {
                    alert(data.message || 'Cập nhật thất bại');
                }
            }
        } catch (error) {
            console.error('Lỗi update:', error);
            alert('Lỗi kết nối đến server.');
        }
    });

    // Hàm ẩn hiện nút
    function toggleButtons(isEditing) {
        btnEdit.style.display = isEditing ? 'none' : 'inline-block';
        btnSave.style.display = isEditing ? 'inline-block' : 'none';
        btnCancel.style.display = isEditing ? 'inline-block' : 'none';
    }
});

// --- HÀM LẤY DỮ LIỆU USER ---
async function getUserProfile() {
    try {

        const token = localStorage.getItem("accessToken");

        if (!token) {

            window.location.href = "/signin"; 
            return;
        }

        const res = await fetch('/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` //
            }
        });

        const data = await res.json();

        if (res.ok) {
            const user = data.user || data; 

            document.getElementById('name').value = user.name || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('cccd').value = user.cccd || '';
            document.getElementById('address').value = user.address || '';


        } else {
   
            if (res.status === 401 || res.status === 403) {
                console.warn("Token hết hạn hoặc không hợp lệ");
                localStorage.removeItem("accessToken"); 
                window.location.href = "/signin"; 
            } else {
                console.error("Lỗi tải profile:", data.message);
                alert("Không thể tải thông tin: " + data.message);
            }
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
    }
}