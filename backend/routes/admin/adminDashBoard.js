const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController.js');

router.get('/', adminController.getAdminPage);

module.exports = router;
