require('dotenv').config(); 
const express = require('express');
require('./configs/database'); 
// const accountRoutes = require('./routes/accountRoutes');
const homeRoutes = require('./routes/homeRoutes');

// Routes khi truy cập trinh duyệt thì trả về / trống (vd trang admin trả về /admin)
// route làm gì? route sẽ định nghĩa truy cập vào cái gì trên trình duyệt thì trả về hàm trong controller tương ứng (cái này mọi người hỏi chatgpt để hiểu)
const app = express();
app.use(express.json());
// app.use('/accounts', accountRoutes);
app.use('/', homeRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên http://localhost:${PORT}`);
});