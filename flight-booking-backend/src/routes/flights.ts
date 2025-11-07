import express from 'express';
import { getFlightDetails } from '../controllers/flightController';
// Import các hàm controller khác nếu bạn có (ví dụ: searchFlights)

const router = express.Router();

/**
 * @route   GET /api/flights/:id
 * @desc    Lấy chi tiết một chuyến bay (bao gồm cả seatMap)
 * @access  Public
 */
router.get(
  '/:id',
  getFlightDetails // Hàm controller bạn sẽ viết ở bước tiếp theo
);

/**
 * @route   GET /api/flights
 * @desc    Tìm kiếm chuyến bay (phần này bạn của bạn có thể làm)
 * @access  Public
 */
// router.get('/', searchFlights);

export default router;