import express from "express";
import {
    getRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomEnums,
    getRoomDetail
} from "../controllers/roomController.js";

const router = express.Router();

// CRUD
router.get("/", getRooms);
//user
router.get("/:id", getRoomDetail);
router.get("/one/:id", getRoomById);
router.post("/", createRoom);
router.put("/one/:id", updateRoom);
router.delete("/one/:id", deleteRoom);

// ENUM
router.get("/enums", getRoomEnums);

export default router;
