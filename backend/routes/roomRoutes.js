import express from "express";
import {
    getRoomEnums,
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomDetail,
    getRoomsForHome,
    getPromotionRoom
} from "../controllers/roomController.js";

const router = express.Router();

// dùng cho homepage (rooms section)
router.get("/home", getRoomsForHome);
router.get("/promotion", getPromotionRoom);
// CRUD
router.get("/", getRooms);

// ENUM
router.get("/enums", getRoomEnums);
//user
router.get("/:id", getRoomDetail);
router.get("/one/:id", getRoomById);
router.post("/", createRoom);
router.put("/one/:id", updateRoom);
router.delete("/one/:id", deleteRoom);




export default router;
