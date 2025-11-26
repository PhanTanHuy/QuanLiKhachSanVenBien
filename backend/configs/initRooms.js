import Room from '../models/Room.js';
import SampleRooms from '../mock/sampleRooms.js';

export default async function initRooms() {
    const count = await Room.countDocuments();
    if (count === 0) {
        await Room.insertMany(SampleRooms);
        console.log("Đã khởi tạo dữ liệu phòng mẫu!");
    }
}
