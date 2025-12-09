import express from 'express';
import * as adminController from '../../controllers/admin/adminController.js';

const router = express.Router();

router.get('/dashboard', adminController.getAdminDashboard);
router.get('/rooms', adminController.getAdminRooms);
router.get('/users', adminController.getAdminUsers);
router.get('/bookings', adminController.getAdminBookings);

export default router;
