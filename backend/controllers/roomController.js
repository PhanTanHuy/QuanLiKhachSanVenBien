const Room = require('../models/Rooms.js');
const { RoomType, RoomStatus } = require('../configs/roomEnum');

// API trả enum cho frontend
exports.getRoomEnums = (req, res) => {
    res.json({
        types: Object.values(RoomType),
        statuses: Object.values(RoomStatus)
    });
};
// --- GET all rooms ---
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- GET single room by id ---
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findOne({ id: req.params.id });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CREATE room ---
exports.createRoom = async (req, res) => {
    try {
        const existing = await Room.findOne({ id: req.body.id });
        if (existing) return res.status(400).json({ message: "Room ID already exists" });

        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- UPDATE room ---
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- DELETE room ---
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findOneAndDelete({ id: req.params.id });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json({ message: "Room deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
