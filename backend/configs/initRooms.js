const Room = require('../models/Rooms');
const SampleRooms = require('./sampleRooms');

async function initRooms() {
    const count = await Room.countDocuments();
    if (count === 0) {
        await Room.insertMany(SampleRooms);
        console.log("Đã khởi tạo dữ liệu phòng mẫu!");
    }
}

module.exports = initRooms;
