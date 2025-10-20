const express = require('express');
const app = express();

// Middleware để parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Server đang chạy!');
});

// Khai báo port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});
