import express from "express";
import {
    getRoomEnums,
    getRooms,
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomDetail,
    getRoomsForHome,
    getPromotionRoom
} from "../controllers/roomController.js";

const router = express.Router();

// ENUM - phải đặt trước các route động /:id
router.get("/enums", getRoomEnums);

// dùng cho homepage (rooms section)
router.get("/home", getRoomsForHome);
router.get("/promotion", getPromotionRoom);

router.get("/", getRooms);
router.get("/all", getAllRooms);
//user
router.get("/:id", getRoomDetail);
router.get("/one/:id", getRoomById);
router.post("/", createRoom);
router.put("/one/:id", updateRoom);
router.delete("/one/:id", deleteRoom);

export default router;
