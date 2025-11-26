import mongoose from "mongoose";
import initRooms from "./initRooms.js";
import initUsers from "./initUsers.js";
import initBookings from "./initBookings.js";

mongoose
  .connect(process.env.MONGO_URI, { dbName: "QuanLiKhachSan" })
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công");
    initRooms();
    initUsers();
    initBookings();
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));
