import NhaXuatBan from '../models/NhaXuatBan.js';
import Sach from '../models/Sach.js';

export const getAllNhaXuatBan = async (req, res) => {
  try {
    const nhaXuatBans = await NhaXuatBan.find();
    res.status(200).json({
      success: true,
      count: nhaXuatBans.length,
      data: nhaXuatBans
    });
  } catch (error) {    
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách nhà xuất bản',
      error: error.message
    });
  }
};

export const getNhaXuatBanById = async (req, res) => {
  try {
    const nhaXuatBan = await NhaXuatBan.findOne({ MaNXB: req.params.id });
    
    if (!nhaXuatBan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }
    
    res.status(200).json({
      success: true,
      data: nhaXuatBan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin nhà xuất bản',
      error: error.message
    });
  }
};

export const createNhaXuatBan = async (req, res) => {
  try {
    const newNhaXuatBan = new NhaXuatBan(req.body);
    await newNhaXuatBan.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo nhà xuất bản thành công',
      data: newNhaXuatBan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể tạo nhà xuất bản',
      error: error.message
    });
  }
};

export const updateNhaXuatBan = async (req, res) => {
  try {
    const nhaXuatBan = await NhaXuatBan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!nhaXuatBan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật nhà xuất bản thành công',
      data: nhaXuatBan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Không thể cập nhật nhà xuất bản',
      error: error.message
    });
  }
};

export const deleteNhaXuatBan = async (req, res) => {
  try {
    const sachCount = await Sach.countDocuments({ _id: req.params.id });
    
    if (sachCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa nhà xuất bản đang có sách'
      });
    }
    
    const nhaXuatBan = await NhaXuatBan.findByIdAndDelete(req.params.id);
    
    if (!nhaXuatBan) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa nhà xuất bản thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa nhà xuất bản',
      error: error.message
    });
  }
};

export const getNhaXuatBanBooks = async (req, res) => {
  try {
    const sachs = await Sach.find({ MaNXB: req.params.id });
    
    res.status(200).json({
      success: true,
      count: sachs.length,
      data: sachs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách sách của nhà xuất bản',
      error: error.message
    });
  }
};