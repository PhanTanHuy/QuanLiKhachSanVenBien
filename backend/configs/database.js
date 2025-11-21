import mongoose from "mongoose";
import initRooms from "./initRooms.js";

mongoose
  .connect(process.env.MONGO_URI, { dbName: "QuanLiKhachSan" })
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công");
    initRooms();
  })
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));
