const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { dbName: 'QuanLiKhachSan' })
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));