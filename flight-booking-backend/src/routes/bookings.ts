// src/routes/bookings.ts
import express from 'express';
import { createBooking } from '../controllers/bookingController';
import { auth } from '../middleware/auth'; // Đảm bảo đường dẫn đúng

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Tạo một booking mới
 * @access  Private (Bắt buộc đăng nhập)
 */
router.post(
  '/',
  auth,  // Middleware kiểm tra xem người dùng đã đăng nhập chưa
  createBooking // Hàm xử lý logic chính
);

// Bạn cũng có thể thêm các route khác ở đây
// router.get('/my-bookings', auth, getMyBookings);

export default router;