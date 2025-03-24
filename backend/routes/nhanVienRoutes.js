import express from 'express';
import {
  getAllNhanVien,
  getNhanVienById,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien,
  updateProfile
} from '../controllers/nhanVienController.js';
import { authenticate , authorizeAdmin } from '../controllers/authController.js';

const router = express.Router();

router.use(authenticate);
router.put('/profile', updateProfile);
router.use(authorizeAdmin);
router.get('/', getAllNhanVien);
router.get('/:id', getNhanVienById);
router.post('/', createNhanVien);
router.put('/:id', updateNhanVien);
router.delete('/:id', deleteNhanVien);

export default router;