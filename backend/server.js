require('dotenv').config(); 
const express = require('express');
require('./configs/database'); 
const path = require('path'); 
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');

const app = express();
app.use(express.json());
//load aset
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});