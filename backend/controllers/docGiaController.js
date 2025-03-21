import DocGia from '../models/DocGia.js';
import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';

export const getAllDocGia = async (req, res) => {
  try {
    const docGias = await DocGia.find();
    res.status(200).json({
      success: true,
      count: docGias.length,
      data: docGias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách độc giả',
      error: error.message
    });
  }
};

export const getDocGiaById = async (req, res) => {
  try {
    const docGia = await DocGia.findById(req.params.id);
    
    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả'
      });
    }
    
    res.status(200).json({
      success: true,
      data: docGia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin độc giả',
      error: error.message
    });
  }
};

export const createDocGia = async (req, res) => {
  try {
    if (!req.body.NgaySinh) {
      return res.status(400).json({ success: false, message: "Ngày sinh không được để trống" });
    }

    let ngaySinhChuan;

    // Kiểm tra xem ngày sinh có phải là một chuỗi hợp lệ không
    let ngaySinhString = req.body.NgaySinh.toString().trim();

    // Kiểm tra định dạng và chuẩn hóa
    if (ngaySinhString.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      // Nếu định dạng là "DD-MM-YYYY"
      const [day, month, year] = ngaySinhString.split('-');
      ngaySinhChuan = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`);
    } else if (ngaySinhString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      // Nếu định dạng là "DD/MM/YYYY"
      const [day, month, year] = ngaySinhString.split('/');
      ngaySinhChuan = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`);
    } else if (ngaySinhString.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
      // Nếu định dạng là "YYYY-MM-DD"
      ngaySinhChuan = new Date(`${ngaySinhString}T00:00:00.000Z`);
    } else {
      return res.status(400).json({ success: false, message: "Ngày sinh không hợp lệ" });
    }
    // Kiểm tra nếu ngày không hợp lệ
    if (isNaN(ngaySinhChuan.getTime())) {
      return res.status(400).json({ success: false, message: "Ngày sinh không hợp lệ" });
    }
    // Gán ngày sinh đã chuẩn hóa vào body
    req.body.NgaySinh = ngaySinhChuan;

    const newDocGia = new DocGia(req.body);
    await newDocGia.save();

    res.status(201).json({ success: true, message: "Tạo độc giả thành công", data: newDocGia });
  } catch (error) {
    res.status(400).json({ success: false, message: "Không thể tạo độc giả", error: error.message });
  }
};

export const updateDocGia = async (req, res) => {
  try {
    if (req.body.NgaySinh) {
      let ngaySinhDate;
      // Chuẩn hóa ngày sinh: Chèn số 0 vào nếu cần
      const standardizeDate = (dateStr) => {
        return dateStr
          .split("-")
          .map((part, index) => (index === 0 && part.length === 4 ? part : part.padStart(2, "0")))
          .join("-");
      };
      req.body.NgaySinh = standardizeDate(req.body.NgaySinh);
      // Kiểm tra nếu ngày sinh theo định dạng dd-mm-yyyy
      if (/^\d{2}-\d{2}-\d{4}$/.test(req.body.NgaySinh)) {
        const [day, month, year] = req.body.NgaySinh.split("-");
        ngaySinhDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
      }
      // Kiểm tra nếu ngày sinh theo định dạng yyyy-mm-dd
      else if (/^\d{4}-\d{2}-\d{2}$/.test(req.body.NgaySinh)) {
        ngaySinhDate = new Date(`${req.body.NgaySinh}T00:00:00.000Z`);
      }
      // Nếu không đúng định dạng
      else {
        return res.status(400).json({
          success: false,
          message: "Ngày sinh không hợp lệ! Vui lòng nhập theo định dạng dd-mm-yyyy hoặc yyyy-mm-dd",
        });
      }
      // Kiểm tra ngày hợp lệ
      if (isNaN(ngaySinhDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Ngày sinh không hợp lệ",
        });
      }

      req.body.NgaySinh = ngaySinhDate; // Lưu vào DB với kiểu Date
    }

    const docGia = await DocGia.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy độc giả",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật độc giả thành công",
      data: docGia,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể cập nhật độc giả",
      error: error.message,
    });
  }
};


export const deleteDocGia = async (req, res) => {
  try {
    const borrowings = await TheoDoiMuonSach.find({
      MaDocGia: req.params.id,
      TrangThai: 'Đang mượn'
    });
    
    if (borrowings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa độc giả đang mượn sách'
      });
    }
    
    const docGia = await DocGia.findByIdAndDelete(req.params.id);
    
    if (!docGia) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy độc giả'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa độc giả thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa độc giả',
      error: error.message
    });
  }
};

export const getDocGiaBorrowHistory = async (req, res) => {
  try {
    const borrowHistory = await TheoDoiMuonSach.find({ MaDocGia: req.params.id })
      .populate('MaSach', 'TenSach TacGia')
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
