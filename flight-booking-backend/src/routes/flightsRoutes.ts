// src/routes/flight.routes.ts
import express from 'express';
import { 
  getAllFlights, 
  searchFlights,
  getFlightById,
  searchMultiCityFlights // 👈 thêm controller mới
} from '../controllers/flightController';

const router = express.Router();

/**
 * @route   GET /api/flights
 * @desc    Get all flights
 * @access  Public
 */
router.get('/', getAllFlights);

/**
 * @route   GET /api/flights/search
 * @desc    Search one-way or round-trip flights
 * @access  Public
 */
router.get('/search', searchFlights);

/**
 * @route   POST /api/flights/search/multi
 * @desc    Search multi-city flights
 * @access  Public
 * @body    [
 *   { from: "HCM", to: "HAN", departDate: "2025-07-12" },
 *   { from: "HAN", to: "DAD", departDate: "2025-07-15" },
 *   ...
 * ]
 */
router.post('/search/multi', searchMultiCityFlights);

/**
 * @route   GET /api/flights/:id
 * @desc    Get flight by ID
 * @access  Public
 */
router.get('/:id', getFlightById);

export default router;
