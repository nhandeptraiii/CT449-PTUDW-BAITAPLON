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

const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);

export default TheoDoiMuonSach;