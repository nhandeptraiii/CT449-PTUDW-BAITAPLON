import mongoose from 'mongoose';

const docGiaSchema = new mongoose.Schema({
  MaDocGia: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  HoLot: {
    type: String,
    required: true,
    trim: true
  },
  Ten: {
    type: String,
    required: true,
    trim: true
  },
  NgaySinh: {
    type: Date,
    required: true
  },
  Phai: {
    type: String,
    required: true,
    enum: ['Nam', 'Nữ', 'Khác']
  },
  DiaChi: {
    type: String,
    required: true,
    trim: true
  },
  DienThoai: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


const DocGia = mongoose.model('DocGia', docGiaSchema);

export default DocGia;