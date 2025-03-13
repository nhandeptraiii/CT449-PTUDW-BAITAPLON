import jwt from 'jsonwebtoken';
import NhanVien from '../models/NhanVien.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực'
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const nhanVien = await NhanVien.findById(decoded.id).select('-Password');
        
        if (!nhanVien) {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ'
            });
        }
        
        req.nhanVien = nhanVien;
        next();
    } catch (error) {
        res.status(401).json({
        success: false,
        message: 'Không có quyền truy cập',
        error: error.message
        });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.nhanVien.ChucVu !== 'Quan Tri Vien') {
        return res.status(403).json({
        success: false,
        message: 'Không có quyền quản trị viên'
        });
    }

    next();
};

export const authorizeLibrarian = (req, res, next) => {
    if (req.nhanVien.ChucVu !== 'Quan Tri Vien' && req.nhanVien.ChucVu !== 'Thu Thu') {
        return res.status(403).json({
        success: false,
        message: 'Không có quyền thủ thư'
        });
    }

    next();
};

export const getCurrentUser = async (req, res) => {
try {
    res.status(200).json({
    success: true,
    data: req.nhanVien
    });
} catch (error) {
    res.status(500).json({
    success: false,
    message: 'Không thể lấy thông tin nhân viên',
    error: error.message
    });
}
};