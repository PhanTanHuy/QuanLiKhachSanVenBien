import 'dotenv/config';
import mongoose from 'mongoose';
import Room from './models/Room.js';

mongoose.connect(process.env.MONGO_URI, { dbName: "QuanLiKhachSan" })
  .then(async () => {
    console.log("Connected");
    const count = await Room.countDocuments();
    console.log("Total rooms:", count);

    const available = await Room.countDocuments({ status: "Trống" });
    console.log("Available rooms:", available);

    const sample = await Room.find().limit(3);
    console.log("Sample rooms:", sample);

    process.exit(0);
  })
  .catch(err => console.error(err));