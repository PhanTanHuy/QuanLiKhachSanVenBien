const path = require('path');

exports.getAdminDashboard = (req, res) => {
    const adminPath = path.resolve(__dirname, '../../../frontend/pages/admin/dashboard.html');
    res.sendFile(adminPath);
};
exports.getAdminRooms= (req, res) => {
    const adminPath = path.resolve(__dirname, '../../../frontend/pages/admin/rooms.html');
    res.sendFile(adminPath);
};
exports.getAdminUsers = (req, res) => {
    const adminPath = path.resolve(__dirname, '../../../frontend/pages/admin/users.html');
    res.sendFile(adminPath);
};
