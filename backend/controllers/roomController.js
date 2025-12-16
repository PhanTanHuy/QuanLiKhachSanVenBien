import Room from "../models/Room.js";
import { RoomType, RoomStatus } from "../configs/enum/roomEnum.js";


// API trả enum cho frontend
export const getRoomEnums = (req, res) => {
    res.json({
        types: Object.values(RoomType),
        statuses: Object.values(RoomStatus)
    });
};

// --- GET all rooms ---
// export const getRooms = async (req, res) => {
//     try {
//         const rooms = await Room.find({});
//         res.json(rooms);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
// roomController.js
export const getRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Room.countDocuments()
    ]);

    res.json({
      success: true,
      data: rooms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * GET /api/rooms/:id
 */
export const getRoomDetail = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phòng"
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- GET single room by id ---
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findOne({ id: req.params.id });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CREATE room ---
export const createRoom = async (req, res) => {
    try {
        const existing = await Room.findOne({ id: req.body.id });
        if (existing)
            return res.status(400).json({ message: "Room ID already exists" });

        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- UPDATE room ---
export const updateRoom = async (req, res) => {
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
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findOneAndDelete({ id: req.params.id });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json({ message: "Room deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
