import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import docGiaRoutes from './routes/docGiaRoutes.js';
import sachRoutes from './routes/sachRoutes.js';
import nhaXuatBanRoutes from './routes/nhaXuatBanRoutes.js';
import theoDoiMuonSachRoutes from './routes/theoDoiMuonSachRoutes.js';
import nhanVienRoutes from './routes/nhanVienRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/docgia', docGiaRoutes);
app.use('/api/sach', sachRoutes);
app.use('/api/nhaxuatban', nhaXuatBanRoutes);
app.use('/api/muonsach', theoDoiMuonSachRoutes);
app.use('/api/nhanvien', nhanVienRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Quản lý Mượn Sách đang hoạt động');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Lỗi máy chủ',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

export default app;