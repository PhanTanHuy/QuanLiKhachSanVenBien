require('dotenv').config(); 
const express = require('express');
require('./configs/database'); 
const path = require('path'); 
const homeRoutes = require('./routes/homeRoutes');
const adminDashBoard = require('./routes/admin/adminDashBoard');

const app = express();
app.use(express.json());
//load aset
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

app.use('/', adminDashBoard);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});