import Sach from '../models/Sach.js';
import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';

export const getAllSach = async (req, res) => {
  try {
    const sachs = await Sach.find().populate('MaNXB', 'MaNXB TenNXB');
    res.status(200).json({
      success: true,
      count: sachs.length,
      data: sachs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách sách',
      error: error.message
    });
  }
};

export const getSachById = async (req, res) => {
  try {
    const sach = await Sach.findOne({ MaSach: req.params.id }).populate('MaNXB', 'MaNXB TenNXB');
    
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin sách',
      error: error.message
    });
  }
};

export const createSach = async (req, res) => {
  try {
    const newSach = new Sach(req.body);
    await newSach.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo sách thành công',
      data: newSach
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể tạo sách',
      error: error.message
    });
  }
};

export const updateSach = async (req, res) => {
  try {
    const sach = await Sach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật sách thành công',
      data: sach
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể cập nhật sách',
      error: error.message
    });
  }
};

export const deleteSach = async (req, res) => {
  try {
    const borrowings = await TheoDoiMuonSach.find({
      MaSach: req.params.id,
      TrangThai: 'Đang mượn'
    });
    
    if (borrowings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa sách đang được mượn'
      });
    }
    
    const sach = await Sach.findOneAndDelete({ MaSach: req.params.id });
    
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa sách thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa sách',
      error: error.message
    });
  }
};

export const getSachBorrowHistory = async (req, res) => { //Lich su muon sach
  try {
    const borrowHistory = await TheoDoiMuonSach.find({ MaSach: req.params.id })
      .populate('MaDocGia', 'HoLot Ten')
      .sort({ NgayMuon: -1 });
    
    res.status(200).json({
      success: true,
      count: borrowHistory.length,
      data: borrowHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy lịch sử mượn sách',
      error: error.message
    });
  }
};

export const getSachAvailability = async (req, res) => { //Kiem tra tinh trang co san cua sach
  try {
    const sach = await Sach.findOne({ MaSach: req.params.id });
    
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    
    const borrowedCount = await TheoDoiMuonSach.countDocuments({
      MaSach: req.params.id,
      TrangThai: 'Đang mượn'
    });
    
    const availableCount = sach.SoQuyen - borrowedCount;
    
    res.status(200).json({
      success: true,
      data: {
        MaSach: sach.MaSach,
        TenSach: sach.TenSach,
        TongSo: sach.SoQuyen,
        DangMuon: borrowedCount,
        ConLai: availableCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin sách có sẵn',
      error: error.message
    });
  }
};