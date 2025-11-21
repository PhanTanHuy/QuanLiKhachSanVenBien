import mongoose from "mongoose";
import { RoomType, RoomStatus } from "../configs/roomEnum.js";

const roomSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        type: {
            type: String,
            enum: Object.values(RoomType),
            required: true
        },
        price: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(RoomStatus),
            required: true
        },
        img: { type: String },
        desc: { type: String }
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
