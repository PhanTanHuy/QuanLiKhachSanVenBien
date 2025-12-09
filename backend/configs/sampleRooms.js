import { RoomStatus, RoomType, RoomDescriptions } from "./enum/roomEnum.js";

// --- Pool chứa ảnh ---
export const RoomImagePool = [
    "https://i.pinimg.com/originals/af/28/28/af2828254e6108d2a271caae82c7516c.jpg",
    "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,g=auto,fit=scale-down/ki-cms-prod/images/8/5/8/4/174858-1-eng-GB/766a3591080a-73654499_4K.jpg",
    "https://th.bing.com/th/id/R.523d3f9f261a4e8daaa30c4c106caf9d",
    "https://th.bing.com/th/id/R.8392b0e2311352cedbcc92f02e7c11b3",
    "https://image-tc.galaxy.tf/wijpeg-1zm3djvselo1ujf9q6txaghbl/1-executive-room_standard.jpg",
    "https://bazantravel.com/cdn/medias/uploads/83/83316-pullman-vung-tau-700x466.jpg",
    "https://danang-shopping.com/wp-content/uploads/2018/05/khach-san-duong-bach-da-nang-pariat-hotel-1.jpg",
    "https://tse4.mm.bing.net/th/id/OIP.-hoUYwoWy6l-JV3URT2t2wHaD6"
];

// Lấy ảnh ngẫu nhiên
export const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * RoomImagePool.length);
    return RoomImagePool[randomIndex];
};

// Lấy giá theo loại phòng
export const getRoomPrice = (type) => {
    switch (type) {
        case RoomType.ECONOMY: return 300000;
        case RoomType.STANDARD: return 400000;
        case RoomType.SUPERIOR: return 500000;
        case RoomType.DELUXE: return 600000;
        case RoomType.JUNIOR_SUITE: return 700000;
        case RoomType.FAMILY: return 750000;
        case RoomType.VIP: return 800000;
        case RoomType.SUITE: return 900000;
        case RoomType.BUNGALOW: return 1200000;
        case RoomType.PRESIDENTIAL: return 2000000;
        default: return 400000;
    }
};

// Random enum value
export const getRandomEnumValue = (enumObject) => {
    const values = Object.values(enumObject);
    return values[Math.floor(Math.random() * values.length)];
};

// Tạo 50 phòng ngẫu nhiên
const TOTAL_ROOMS = 50;
let currentFloor = 1;
let roomNumberOnFloor = 1;

const AdditionalSampleRooms = [];

for (let i = 0; i < TOTAL_ROOMS; i++) {

    const roomId = `${currentFloor}${String(roomNumberOnFloor).padStart(2, "0")}`;

    const randomType = getRandomEnumValue(RoomType);
    const randomStatus = getRandomEnumValue(RoomStatus);

    AdditionalSampleRooms.push({
        id: roomId,
        type: randomType,
        price: getRoomPrice(randomType),
        status: randomStatus,
        img: getRandomImage(),
        desc: RoomDescriptions[randomType]
    });

    roomNumberOnFloor++;
    if (roomNumberOnFloor > 5) {
        currentFloor++;
        roomNumberOnFloor = 1;
    }
}

// xuất ra 1 default export cho initRooms
export default AdditionalSampleRooms;
