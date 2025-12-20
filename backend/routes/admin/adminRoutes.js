import express from 'express';
import * as adminController from '../../controllers/admin/adminController.js';

const router = express.Router();


// router.use(protectedRoute, authorize("admin"));
router.get('/dashboard', adminController.getAdminDashboard);
router.get('/rooms', adminController.getAdminRooms);
router.get('/users', adminController.getAdminUsers);
router.get('/bookings', adminController.getAdminBookings);
router.get('/maintenance', adminController.getAdminMaintenance);

export default router;
