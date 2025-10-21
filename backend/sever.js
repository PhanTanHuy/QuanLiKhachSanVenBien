require('dotenv').config(); 
const express = require('express');
require('./configs/database'); 


const app = express();
app.use(express.json());
// connectDB(); 
app.get('/', (req, res) => {
    res.send('Server và Database đang chạy!');
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});