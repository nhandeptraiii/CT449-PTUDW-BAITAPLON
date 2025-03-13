import express from 'express';
import {
  getAllMuonSach,
  getMuonSachById,
  createMuonSach,
  updateMuonSach,
  returnBook,
  getBorrowingBooks,
  getOverdueBooks,
  getBorrowingStatistics
} from '../controllers/theoDoiMuonSachController.js';
import { authorizeLibrarian } from '../controllers/authController.js';

const router = express.Router();

router.use(authorizeLibrarian);
router.get('/', getAllMuonSach);
router.get('/borrowing', getBorrowingBooks);
router.get('/overdue', getOverdueBooks);
router.get('/statistics', getBorrowingStatistics);
router.get('/:id', getMuonSachById);
router.post('/', createMuonSach);
router.put('/:id', updateMuonSach);
router.put('/:id/return', returnBook);

export default router;