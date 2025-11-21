import path from 'path';
import { fileURLToPath } from 'url';

// Tạo __dirname tương đương trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAdminDashboard = (req, res) => {
    const adminPath = path.resolve(__dirname, '../../../frontend/pages/admin/dashboard.html');
    res.sendFile(adminPath);
};

export const getAdminRooms = (req, res) => {
    const adminPath = path.resolve(__dirname, '../../../frontend/pages/admin/rooms.html');
    res.sendFile(adminPath);
};

export const getAdminUsers = (req, res) => {
    const adminPath = path.resolve(__dirname, '../../../frontend/pages/admin/users.html');
    res.sendFile(adminPath);
};
