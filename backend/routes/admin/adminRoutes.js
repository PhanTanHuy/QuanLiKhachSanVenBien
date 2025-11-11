const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController.js');

router.get('/dashboard', adminController.getAdminDashboard);
router.get('/rooms', adminController.getAdminRooms);
router.get('/users', adminController.getAdminUsers);


module.exports = router;
