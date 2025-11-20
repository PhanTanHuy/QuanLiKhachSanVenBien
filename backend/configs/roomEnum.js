const RoomStatus = {
    AVAILABLE: "Trống",      // Trống
    OCCUPIED: "Đang thuê",        // Đang thuê
    RESERVED: "Đã đặt cọc",        // Đã đặt cọc
    MAINTENANCE: "Đang bảo trì"   // Đang bảo trì
};

const RoomType = {
    STANDARD: "Standard",
    SUPERIOR: "Superior",
    DELUXE: "Deluxe",
    JUNIOR_SUITE: "Junior Suite",
    SUITE: "Suite",
    VIP: "VIP",
    PRESIDENTIAL: "Presidential",
    FAMILY: "Family",
    ECONOMY: "Economy",
    BUNGALOW: "Bungalow"
};

const RoomDescriptions = {
    "Economy": "Phòng nhỏ, tiện nghi cơ bản, không cửa sổ, thích hợp cho khách ngắn ngày.",
    "Standard": "Phòng tiêu chuẩn, đầy đủ tiện nghi, giường đôi, có cửa sổ.",
    "Superior": "Phòng Superior thoáng mát, cửa sổ rộng, máy lạnh, TV.",
    "Deluxe": "Phòng Deluxe sang trọng, có cửa sổ lớn nhiều ánh sáng, minibar.",
    "Junior Suite": "Phòng Junior Suite, không gian rộng rãi, buffet sáng miễn phí, view đẹp.",
    "Suite": "Phòng Suite cao cấp, ban công riêng, nội thất sang trọng, view hướng biển.",
    "VIP": "Phòng VIP đầy đủ tiện nghi, ban công, máy pha cà phê, tầm nhìn tuyệt đẹp.",
    "Presidential": "Phòng Presidential siêu sang, phòng khách riêng, jacuzzi, minibar cao cấp.",
    "Family": "Phòng gia đình, 2 giường lớn, không gian rộng, đầy đủ tiện nghi.",
    "Bungalow": "Phòng Bungalow riêng biệt, view thiên nhiên, không gian yên tĩnh, có sân vườn."
};

module.exports = { RoomStatus, RoomType, RoomDescriptions };
