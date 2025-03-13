import mongoose from 'mongoose';

const sachSchema = new mongoose.Schema({
    MaSach: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    TenSach: {
        type: String,
        required: true,
        trim: true
    },
    DonGia: {
        type: Number,
        required: true,
        min: 0
    },
    SoQuyen: {
        type: Number,
        required: true,
        min: 0
    },
    NamXuatBan: {
        type: Number,
        required: true
    },
    MaNXB: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'NhaXuatBan'
    },
    TacGia: {
        type: String,
        trim: true
    }
    }, {
    timestamps: true
});


const Sach = mongoose.model('Sach', sachSchema);

export default Sach;