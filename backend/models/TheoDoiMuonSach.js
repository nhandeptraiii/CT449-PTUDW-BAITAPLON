import mongoose from 'mongoose';

const theoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'DocGia'
  },
  MaSach: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Sach'
  },
  MSNV: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'NhanVien'
  },
  NgayMuon: {
    type: Date,
    required: true,
    default: Date.now
  },
  NgayTra: {
    type: Date
  }
}, {
  timestamps: true
});

theoDoiMuonSachSchema.index({ MaDocGia: 1, MaSach: 1, NgayMuon: 1 }, { unique: true });

const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema,'muonsach');

export default TheoDoiMuonSach;