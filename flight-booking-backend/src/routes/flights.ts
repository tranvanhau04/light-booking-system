import express from 'express';
import { 
  getFlightDetails, 
  searchFlights, 
  getUniqueAirports,
  getAirportsFromFlights  // ← THÊM IMPORT MỚI
} from '../controllers/flightController';

const router = express.Router();

/**
 * @route   GET /api/flights/airports-from-flights
 * @desc    Lấy airports từ Flight table với mapping đầy đủ (MỚI)
 * @access  Public
 */
router.get('/airports-from-flights', getAirportsFromFlights);

/**
 * @route   GET /api/flights/airports
 * @desc    Lấy danh sách airports (CŨ - để backward compatible)
 * @access  Public
 */
router.get('/airports', getUniqueAirports);

/**
 * @route   GET /api/flights/search
 * @desc    Tìm kiếm chuyến bay
 * @access  Public
 */
router.get('/search', searchFlights);

/**
 * @route   GET /api/flights/:id
 * @desc    Lấy chi tiết một chuyến bay
 * @access  Public
 */
router.get('/:id', getFlightDetails);

export default router;