require('dotenv').config(); 
const express = require('express');
require('./configs/database'); 
const path = require('path'); 
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const authRoute = require('./routes/authRoute.js');
const cookiesParser = require('cookie-parser');
const { protectedRoute } = require('./middlewares/authMiddleware.js');
const userRpute = require('./routes/userRpute.js');

const roomRoutes = require('./routes/roomRoutes.js');




const app = express();
app.use(express.json());
app.use(cookiesParser());

//load aset
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', adminRoutes);
app.use("/api/rooms", roomRoutes);

app.use("/api/auth", authRoute);
//private routes
app.use(protectedRoute)
app.use("/api/users", userRpute)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});