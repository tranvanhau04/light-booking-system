import express from 'express';
import { 
  getFlightDetails, 
  searchFlights, 
  getUniqueAirports,
  getAirportsFromFlights 
} from '../controllers/flightController';
import { cacheMiddleware } from '../middleware/cache'; // Import Cache Middleware

const router = express.Router();

/**
 * @route   GET /api/flights/airports-from-flights
 * @desc    Lấy airports từ Flight table với mapping đầy đủ (MỚI)
 * @access  Public
 * @note    Dữ liệu sân bay ít thay đổi, Cache giúp load form tìm kiếm tức thì.
 */
router.get('/airports-from-flights', cacheMiddleware('airports_full'), getAirportsFromFlights);

/**
 * @route   GET /api/flights/airports
 * @desc    Lấy danh sách airports (CŨ - để backward compatible)
 * @access  Public
 */
router.get('/airports', cacheMiddleware('airports_simple'), getUniqueAirports);

/**
 * @route   GET /api/flights/search
 * @desc    Tìm kiếm chuyến bay
 * @access  Public
 * @note    Cache key sẽ bao gồm cả query params (VD: flight_search:/api/flights/search?from=HAN&to=SGN)
 */
router.get('/search', cacheMiddleware('flight_search'), searchFlights);

/**
 * @route   GET /api/flights/:id
 * @desc    Lấy chi tiết một chuyến bay
 * @access  Public
 */
router.get('/:id', cacheMiddleware('flight_detail'), getFlightDetails);

export default router;