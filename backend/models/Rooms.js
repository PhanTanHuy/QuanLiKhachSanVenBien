const mongoose = require('mongoose');
const { RoomType, RoomStatus } = require('../configs/roomEnum');

const roomSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
