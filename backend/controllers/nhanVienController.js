import NhanVien from '../models/NhanVien.js';
import jwt from 'jsonwebtoken';

export const getAllNhanVien = async (req, res) => {
  try {
    const nhanViens = await NhanVien.find().select('-Password');
    res.status(200).json({
      success: true,
      count: nhanViens.length,
      data: nhanViens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách nhân viên',
      error: error.message
    });
  }
};

export const getNhanVienById = async (req, res) => {
  try {
    const nhanVien = await NhanVien.findOne({ MSNV: req.params.id }).select('-Password');
    
    if (!nhanVien) {
      return res.status(404).json({
        success: false, 
        message: 'Không tìm thấy nhân viên'
      });
    }
    
    res.status(200).json({
      success: true,
      data: nhanVien
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin nhân viên',
      error: error.message
    });
  }
};

export const createNhanVien = async (req, res) => {
  req.body.Password = '123456';
  try {
    const newNhanVien = new NhanVien(req.body);
    await newNhanVien.save();
    
    const nhanVienResponse = newNhanVien.toObject();
    delete nhanVienResponse.Password;
    
    res.status(201).json({
      success: true,
      message: 'Tạo nhân viên thành công',
      data: nhanVienResponse
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể tạo nhân viên',
      error: error.message
    });
  }
};

export const updateNhanVien = async (req, res) => {
  req.body.Password = '123456';
  try {
    const nhanVien = await NhanVien.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-Password');
    
    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật nhân viên thành công',
      data: nhanVien
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể cập nhật nhân viên',
      error: error.message
    });
  }
};

export const deleteNhanVien = async (req, res) => {
  try {
    const nhanVien = await NhanVien.findByIdAndDelete(req.params.id );
    
    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa nhân viên thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa nhân viên',
      error: error.message
    });
  }
};

export const loginNhanVien = async (req, res) => {
  try {
    const { MSNV, Password } = req.body;
    const nhanVien = await NhanVien.findOne({ MSNV });
    
    if (!nhanVien) {
      return res.status(401).json({
        success: false,
        message: 'Mã số nhân viên không tồn tại'
      });
    }
    const isMatch = await nhanVien.comparePassword(Password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không chính xác'
      });
    }
    
    const token = jwt.sign(
      { id: nhanVien._id, MSNV: nhanVien.MSNV, ChucVu: nhanVien.ChucVu },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    const nhanVienResponse = nhanVien.toObject();
    delete nhanVienResponse.Password;
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      data: nhanVienResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể đăng nhập',
      error: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const nhanVien = await NhanVien.findOne({ MSNV: req.params.id });
    
    if (!nhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }
    
    const isMatch = await nhanVien.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác'
      });
    }
    
    nhanVien.Password = newPassword;
    await nhanVien.save();
    
    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể đổi mật khẩu',
      error: error.message
    });
  }
};