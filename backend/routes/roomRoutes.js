const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// CRUD
router.get('/', roomController.getRooms);
router.get('/one/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/one/:id', roomController.updateRoom);
router.delete('/one/:id', roomController.deleteRoom);
// Enum
router.get('/enums', roomController.getRoomEnums);

module.exports = router;
