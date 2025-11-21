import 'dotenv/config'; // thay cho require('dotenv').config()
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Routes & Middleware
import './configs/database.js'; // database init
import homeRoutes from './routes/homeRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import authRoute from './routes/authRoute.js';
import { protectedRoute } from './middlewares/authMiddleware.js';
import userRoute from './routes/userRpute.js';
import roomRoutes from './routes/roomRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cookiesParser());

// Load static assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes page
app.use('/admin', adminRoutes);


//Route api
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoute);

// Private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});
