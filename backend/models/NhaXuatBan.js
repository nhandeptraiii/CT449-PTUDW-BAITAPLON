import mongoose from 'mongoose';

const nhaXuatBanSchema = new mongoose.Schema({
  MaNXB: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  TenNXB: {
    type: String,
    required: true,
    trim: true
  },
  DiaChi: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});


const NhaXuatBan = mongoose.model('NhaXuatBan', nhaXuatBanSchema,'nhaxuatban');

export default NhaXuatBan;