import Room from '../models/Rooms.js';
import SampleRooms from './sampleRooms.js';

export default async function initRooms() {
    const count = await Room.countDocuments();
    if (count === 0) {
        await Room.insertMany(SampleRooms);
        console.log("Đã khởi tạo dữ liệu phòng mẫu!");
    }
}
