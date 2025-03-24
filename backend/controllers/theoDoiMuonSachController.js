import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';
import Sach from '../models/Sach.js';
import DocGia from '../models/DocGia.js';
import mongoose from 'mongoose';

export const getAllMuonSach = async (req, res) => {
  try {
    const muonSachs = await TheoDoiMuonSach.find()
      .populate('MaDocGia', 'MaDocGia HoLot Ten')
      .populate('MaSach', 'MaSach TenSach TacGia')
      .populate('MSNV', 'MSNV HoTenNV')
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
    const { MaDocGia, MaSach, NgayMuon } = req.body; // Nhận Ngày Mượn từ frontend

    if (!MaDocGia || !MaSach || !NgayMuon) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin MaDocGia, MaSach hoặc NgayMuon',
      });
    }

    // Kiểm tra xem Ngày Mượn có đúng định dạng YYYY-MM-DD không
    if (!/^\d{4}-\d{2}-\d{2}$/.test(NgayMuon)) {
      return res.status(400).json({ success: false, message: 'Ngày mượn không hợp lệ' });
    }

    // Tìm kiếm Độc Giả & Sách
    const docGia = await DocGia.findOne({ MaDocGia });
    const sach = await Sach.findOne({ MaSach });
    const nhanVien = req.nhanVien;

    if (!docGia) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    }

    if (!sach) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
    }

    if (sach.SoQuyen <= 0) {
      return res.status(400).json({ success: false, message: 'Sách đã hết, không thể mượn' });
      
    }

    // Chuyển đổi Ngày Mượn từ string thành kiểu Date
    const ngayMuonDate = new Date(NgayMuon);
    if (isNaN(ngayMuonDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Ngày mượn không hợp lệ' });
    }

    // Tạo bản ghi Mượn Sách
    const newMuonSach = new TheoDoiMuonSach({
      MaDocGia: docGia._id,
      MaSach: sach._id,
      MSNV: nhanVien._id,
      NgayMuon: ngayMuonDate, // Lưu ngày đúng từ frontend
    });

    // Cập nhật số lượng sách
    sach.SoQuyen -= 1;
    await sach.save();
    await newMuonSach.save();

    return res.status(201).json({
      success: true,
      message: 'Tạo bản ghi mượn sách thành công',
      data: newMuonSach,
    });
  } catch (error) {
    console.error('Lỗi khi tạo bản ghi mượn sách:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo bản ghi mượn sách',
      error: error.message,
    });
  }
};

export const updateMuonSach = async (req, res) => {
  console.log("📥 Request cập nhật mượn sách:", req.body);

  try {
    const { NgayTra } = req.body;
    const muonSach = await TheoDoiMuonSach.findById(req.params.id);

    if (!muonSach) {
      console.log("❌ Không tìm thấy phiếu mượn sách!");
      return res.status(404).json({ success: false, message: "Không tìm thấy phiếu mượn sách" });
    }

    console.log("📌 Phiếu mượn trước cập nhật:", muonSach);

    // Kiểm tra nếu ngày trả nhỏ hơn ngày mượn
    if (NgayTra) {
      const ngayMuon = new Date(muonSach.NgayMuon);
      const ngayTra = new Date(NgayTra);

      if (ngayTra < ngayMuon) {
        console.log("⚠️ Ngày trả nhỏ hơn ngày mượn!");
        return res.status(400).json({ success: false, message: "⚠️ Ngày trả không thể nhỏ hơn ngày mượn!" });
      }

      if (!muonSach.NgayTra) {
        const sach = await Sach.findById(muonSach.MaSach);
        if (!sach) {
          console.log("❌ Không tìm thấy sách!");
          return res.status(400).json({ success: false, message: "⚠️ Không tìm thấy sách!" });
        }

        console.log("📚 Sách trước khi cập nhật:", sach);

        // Cộng số sách khi trả
        await Sach.findByIdAndUpdate(muonSach.MaSach, { $inc: { SoQuyen: 1 } });
        console.log("✅ Đã cộng thêm 1 quyển sách!");
      }
    }

    muonSach.NgayTra = NgayTra || muonSach.NgayTra;
    await muonSach.save();

    console.log("✅ Cập nhật thành công:", muonSach);
    res.status(200).json({ success: true, message: "Cập nhật thành công", data: muonSach });

  } catch (error) {
    console.error("🚨 Lỗi cập nhật:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
  }
};



export const returnBook = async (req, res) => {
  console.log("📥 Request cập nhật mượn sách:", req.body);

  try {
    let { NgayTra } = req.body;
    const muonSach = await TheoDoiMuonSach.findById(req.params.id);

    if (!muonSach) {
      console.log("❌ Không tìm thấy phiếu mượn sách!");
      return res.status(404).json({ success: false, message: "Không tìm thấy phiếu mượn sách" });
    }

    console.log("📌 Phiếu mượn trước cập nhật:", muonSach);

    if (NgayTra) {
      // Chuyển đổi NgayTra từ "DD-MM-YYYY" thành "YYYY-MM-DDT00:00:00.000Z"
      const parts = NgayTra.split("-");
      if (parts.length === 3) {
        NgayTra = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`);
      } else {
        NgayTra = new Date(NgayTra);
      }

      console.log("📅 Ngày trả sau khi chuyển đổi:", NgayTra);

      const ngayMuon = new Date(muonSach.NgayMuon);
      
      if (NgayTra < ngayMuon) {
        console.log("⚠️ Ngày trả nhỏ hơn ngày mượn!");
        return res.status(400).json({ success: false, message: "⚠️ Ngày trả không thể nhỏ hơn ngày mượn!" });
      }

      if (!muonSach.NgayTra) {
        const sach = await Sach.findById(muonSach.MaSach);
        if (!sach) {
          console.log("❌ Không tìm thấy sách!");
          return res.status(400).json({ success: false, message: "⚠️ Không tìm thấy sách!" });
        }

        console.log("📚 Sách trước khi cập nhật:", sach);

        // Cộng số sách khi trả
        await Sach.findByIdAndUpdate(muonSach.MaSach, { $inc: { SoQuyen: 1 } });
        console.log("✅ Đã cộng thêm 1 quyển sách!");
      }
    }

    muonSach.NgayTra = NgayTra || muonSach.NgayTra;
    await muonSach.save();

    console.log("✅ Cập nhật thành công:", muonSach);
    res.status(200).json({ success: true, message: "Cập nhật thành công", data: muonSach });

  } catch (error) {
    console.error("🚨 Lỗi cập nhật:", error);
    res.status(500).json({ success: false, message: "⚠️ Ngày trả không hợp lệ! Vui lòng nhập đúng định dạng DD-MM-YYYY hoặc DD/MM/YYYY.", error: error.message });
  }
};

export const deleteMuonSach = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Nhận yêu cầu xóa phiếu mượn: ${id}`);

    const muonSach = await TheoDoiMuonSach.findById(id);
    if (!muonSach) {
      console.log("❌ Không tìm thấy phiếu mượn!");
      return res.status(404).json({ success: false, message: "Không tìm thấy phiếu mượn" });
    }

    // Kiểm tra nếu phiếu mượn chưa có ngày trả
    if (!muonSach.NgayTra) {
      const sach = await Sach.findById(muonSach.MaSach);
      if (sach) {
        await Sach.findByIdAndUpdate(muonSach.MaSach, { $inc: { SoQuyen: 1 } });
        console.log("📚 Đã cộng thêm 1 quyển sách vào kho!");
      } else {
        console.log("⚠️ Không tìm thấy sách để cập nhật số lượng!");
      }
    }

    await TheoDoiMuonSach.findByIdAndDelete(id);
    console.log("✅ Đã xóa phiếu mượn!");

    res.status(200).json({ success: true, message: "Xóa phiếu mượn thành công" });
  } catch (error) {
    console.error("🚨 Lỗi xóa phiếu mượn:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error.message });
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