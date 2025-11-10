const path = require('path');

exports.getAdminPage = (req, res) => {
    const adminPath = path.resolve(__dirname, '../../../frontend/pages/admin/index.html');
    res.sendFile(adminPath);
};
