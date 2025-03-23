import express from 'express';
import {
  getAllMuonSach,
  getMuonSachById,
  createMuonSach,
  updateMuonSach,
  returnBook,
  getBorrowingBooks,
  getOverdueBooks,
  getBorrowingStatistics,
  deleteMuonSach
} from '../controllers/theoDoiMuonSachController.js';
import { authenticate, authorizeLibrarian } from '../controllers/authController.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeLibrarian);
router.get('/', getAllMuonSach);
router.get('/borrowing', getBorrowingBooks);
router.get('/overdue', getOverdueBooks);
router.get('/statistics', getBorrowingStatistics);
router.get('/:id', getMuonSachById);
router.post('/', createMuonSach);
router.put('/:id', updateMuonSach);
router.put('/:id/return', returnBook);
router.delete('/:id', deleteMuonSach);

export default router;