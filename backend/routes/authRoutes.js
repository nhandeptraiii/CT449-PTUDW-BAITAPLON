import express from 'express';
import { loginNhanVien } from '../controllers/nhanVienController.js';
import { authenticate, getCurrentUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginNhanVien);

router.get('/me', authenticate, getCurrentUser);

export default router;