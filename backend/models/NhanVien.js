import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const nhanVienSchema = new mongoose.Schema({
  MSNV: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  HoTenNV: {
    type: String,
    required: true,
    trim: true
  },
  Password: {
    type: String,
    required: true,
    minlength: 6
  },
  ChucVu: {
    type: String,
    required: true,
    trim: true
  },
  DiaChi: {
    type: String,
    required: true,
    trim: true
  },
  SoDienThoai: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

nhanVienSchema.pre('save', async function(next) {
  const nhanVien = this;
  
  if (nhanVien.isModified('Password')) {
    nhanVien.Password = await bcrypt.hash(nhanVien.Password, 8);
  }
  
  next();
});

nhanVienSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.Password);
};

const NhanVien = mongoose.model('NhanVien', nhanVienSchema);

export default NhanVien;