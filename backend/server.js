import 'dotenv/config'; // thay cho require('dotenv').config()
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import cors from "cors";


// Routes & Middleware
import './configs/database.js'; // database init
import homeRoutes from './routes/homeRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import authRoute from './routes/authRoute.js';
import accountRoutes from './routes/accountRoutes.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import userRoute from './routes/userRoute.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());



// Load static assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/reviews', reviewRoutes);





// Signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/Auth/signup.html"));
});

//Sinin page
app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/Auth/signin.html"));
});
app.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/Auth/forgotPassword.html"));
});

// Trang rooms
app.get("/user/rooms", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/user/listRoom.html"));
});



// Routes page
app.use('/admin', adminRoutes);



//Route api
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoute);
app.use('/api/account', accountRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Private routes
// app.use(protectedRoute);
app.use('/api/users', userRoute);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});
