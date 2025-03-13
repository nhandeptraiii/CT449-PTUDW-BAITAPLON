import express from 'express';
import {
  getAllNhaXuatBan,
  getNhaXuatBanById,
  createNhaXuatBan,
  updateNhaXuatBan,
  deleteNhaXuatBan,
  getNhaXuatBanBooks
} from '../controllers/nhaXuatBanController.js';
import { authenticate, authorizeLibrarian } from '../controllers/authController.js';

const router = express.Router();

router.use(authenticate);
router.get('/', getAllNhaXuatBan);
router.get('/:id', getNhaXuatBanById);
router.get('/:id/books', getNhaXuatBanBooks);

router.use(authorizeLibrarian);
router.post('/', createNhaXuatBan);
router.put('/:id', updateNhaXuatBan);
router.delete('/:id', deleteNhaXuatBan);

export default router;