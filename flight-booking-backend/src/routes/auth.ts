import express from 'express';
import { register, login } from '../controllers/authController';
// (Bạn có thể thêm logic validation ở đây nếu muốn)

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Đăng ký
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Đăng nhập
router.post('/login', login);

export default router;