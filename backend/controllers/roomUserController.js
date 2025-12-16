import Room from "../models/Room_user.js";

// GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const { roomType, priceRange } = req.query;

    let filter = {};

    if (roomType) {
      filter.type = roomType;
    }

    if (priceRange) {
      if (priceRange === "1000000+") {
        filter.price = { $gte: 1000000 };
      } else {
        const [min, max] = priceRange.split("-");
        filter.price = {
          $gte: Number(min),
          $lte: Number(max),
        };
      }
    }

    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// GET /api/rooms/:id
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    res.json(room);
  } catch (err) {
    res.status(404).json({ message: "Không tìm thấy phòng" });
  }
};

// POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: "Không thể tạo phòng" });
  }
};
