import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';
import Sach from '../models/Sach.js';
import DocGia from '../models/DocGia.js';

export const getAllMuonSach = async (req, res) => {
  try {
    const muonSachs = await TheoDoiMuonSach.find()
      .populate('MaDocGia', 'HoLot Ten')
      .populate('MaSach', 'TenSach TacGia')
      .sort({ NgayMuon: -1 });
    
    res.status(200).json({
      success: true,
      count: muonSachs.length,
      data: muonSachs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách mượn sách',
      error: error.message
    });
  }
};

export const getMuonSachById = async (req, res) => {
  try {
    const muonSach = await TheoDoiMuonSach.findById(req.params.id)
      .populate('MaDocGia', 'HoLot Ten DiaChi DienThoai')
      .populate('MaSach', 'TenSach TacGia DonGia NamXuatBan');
    
    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu mượn sách'
      });
    }
    
    res.status(200).json({
      success: true,
      data: muonSach
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin phiếu mượn sách',
      error: error.message
    });
  }
};

export const createMuonSach = async (req, res) => {
  try {
    const { MaDocGia, MaSach } = req.body;
    const docGia = await DocGia.findById(MaDocGia);
    const sach = await Sach.findById(MaSach);
    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả'
      });
    }
    
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    
    
    const newMuonSach = new TheoDoiMuonSach(req.body);
    await newMuonSach.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo phiếu mượn sách thành công',
      data: newMuonSach
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể tạo phiếu mượn sách',
      error: error.message
    });
  }
};

export const updateMuonSach = async (req, res) => {
  try {
    const muonSach = await TheoDoiMuonSach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu mượn sách'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật phiếu mượn sách thành công',
      data: muonSach
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể cập nhật phiếu mượn sách',
      error: error.message
    });
  }
};

export const returnBook = async (req, res) => {
  try {
    const muonSach = await TheoDoiMuonSach.findById(req.params.id);
    
    if (!muonSach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phiếu mượn sách'
      });
    }
    
    if (muonSach.NgayTra) {
      return res.status(400).json({
        success: false,
        message: 'Sách đã được trả'
      });
    }
    
    muonSach.NgayTra = new Date();
    
    await muonSach.save();
    
    res.status(200).json({
      success: true,
      message: 'Trả sách thành công',
      data: muonSach
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể trả sách',
      error: error.message
    });
  }
};

export const getBorrowingBooks = async (req, res) => {
  try {
    const muonSachs = await TheoDoiMuonSach.find({ NgayTra: undefined })
      .populate('MaDocGia', 'HoLot Ten')
      .populate('MaSach', 'TenSach TacGia')
      .sort({ NgayMuon: -1 });
    
    res.status(200).json({
      success: true,
      count: muonSachs.length,
      data: muonSachs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách sách đang mượn',
      error: error.message
    });
  }
};

export const getOverdueBooks = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const muonSachs = await TheoDoiMuonSach.find({
      NgayMuon: { $lt: thirtyDaysAgo }
    })
      .populate('MaDocGia', 'HoLot Ten DiaChi DienThoai')
      .populate('MaSach', 'TenSach TacGia')
      .sort({ NgayMuon: 1 });
    
    res.status(200).json({
      success: true,
      count: muonSachs.length,
      data: muonSachs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách sách quá hạn',
      error: error.message
    });
  }
};

export const getBorrowingStatistics = async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const totalBorrowings = await TheoDoiMuonSach.countDocuments();
        const activeBorrowings = await TheoDoiMuonSach.countDocuments({ NgayTra: undefined });
        const returnedBorrowings = await TheoDoiMuonSach.countDocuments({ NgayTra });
        const overdueBorrowings = await TheoDoiMuonSach.countDocuments({ NgayMuon: { $lt: thirtyDaysAgo } });
        
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const borrowingsThisMonth = await TheoDoiMuonSach.countDocuments({
            NgayMuon: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth
            }
        });
        
        res.status(200).json({
            success: true,
            data: {
                totalBorrowings,
                activeBorrowings,
                returnedBorrowings,
                overdueBorrowings,
                borrowingsThisMonth
            }
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Không thể lấy thống kê mượn sách',
        error: error.message
        });
    }
};