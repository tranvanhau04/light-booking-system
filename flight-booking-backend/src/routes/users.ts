import express from 'express';
import { getMe } from '../controllers/userController';
import { auth } from '../middleware/auth'; // Import auth middleware

const router = express.Router();

// @route   GET /api/users/me
// @desc    Lấy thông tin user hiện tại
// @access  Private (Bắt buộc đăng nhập)
router.get(
  '/me',
  auth, // <-- Thêm middleware 'auth' ở đây
  getMe
);

export default router;