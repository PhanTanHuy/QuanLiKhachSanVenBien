const { RoomStatus, RoomType, RoomDescriptions } = require('./roomEnum');
// Mảng chứa các URL hình ảnh cố định
const RoomImagePool = [
    "https://i.pinimg.com/originals/af/28/28/af2828254e6108d2a271caae82c7516c.jpg",
    "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,g=auto,fit=scale-down/ki-cms-prod/images/8/5/8/4/174858-1-eng-GB/766a3591080a-73654499_4K.jpg",
    "https://th.bing.com/th/id/R.523d3f9f261a4e8daaa30c4c106caf9d?rik=WKplBLXvEZRR2w&riu=http%3a%2f%2frosycruise.com%2fwp-content%2fuploads%2f2020%2f06%2fVip_1-1-2048x1365.jpg&ehk=72F4eyeG9TB0CnraXIaXaizw8loeij%2bc8fR%2bMcsW%2bPM%3d&risl=&pid=ImgRaw&r=0",
    "https://th.bing.com/th/id/R.8392b0e2311352cedbcc92f02e7c11b3?rik=DXc3daZ3m6rgeA&riu=http%3a%2f%2fcache.marriott.com%2fmarriottassets%2fmarriott%2fLONPL%2flonpl-guestroom-0117-hor-clsc.jpg%3finterpolation%3dprogressive-bilinear%26&ehk=WQre5XE1XBiMC2CJR0OZktG3PwF%2fbqWF5%2f6XhpuXfaI%3d&risl=&pid=ImgRaw&r=0",
    "https://image-tc.galaxy.tf/wijpeg-1zm3djvselo1ujf9q6txaghbl/1-executive-room_standard.jpg?crop=84%2C0%2C1333%2C1000",
    "https://bazantravel.com/cdn/medias/uploads/83/83316-pullman-vung-tau-700x466.jpg",
    "https://danang-shopping.com/wp-content/uploads/2018/05/khach-san-duong-bach-da-nang-pariat-hotel-1.jpg",
    "https://tse4.mm.bing.net/th/id/OIP.-hoUYwoWy6l-JV3URT2t2wHaD6?w=1432&h=758&rs=1&pid=ImgDetMain&o=7&rm=3",
];

// Hàm lấy URL hình ảnh ngẫu nhiên
const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * RoomImagePool.length);
    return RoomImagePool[randomIndex];
};

// Hàm lấy giá cố định theo loại phòng
const getRoomPrice = (type) => {
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

const getRandomEnumValue = (enumObject) => {
    const values = Object.values(enumObject);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
};

// --- VÒNG LẶP TẠO 50 PHÒNG ---
const AdditionalSampleRooms = [];
const TOTAL_ROOMS = 50;
let currentFloor = 1;
let roomNumberOnFloor = 1;

for (let i = 0; i < TOTAL_ROOMS; i++) {
    const roomId = `${currentFloor}${String(roomNumberOnFloor).padStart(2, '0')}`;
    
    const randomType = getRandomEnumValue(RoomType);
    const randomStatus = getRandomEnumValue(RoomStatus);
    
    const newRoom = {
        id: roomId,
        type: randomType,
        price: getRoomPrice(randomType), 
        status: randomStatus,
        img: getRandomImage(),
        desc: RoomDescriptions[randomType] 
    };

    AdditionalSampleRooms.push(newRoom);

    roomNumberOnFloor++;
    if (roomNumberOnFloor > 5) {
        currentFloor++;
        roomNumberOnFloor = 1; 
    }
}
module.exports = AdditionalSampleRooms;