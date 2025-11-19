import express from 'express';
import { 
  createBooking, 
  getUserBookings,
  getBookingById 
} from '../controllers/bookingController';
import { auth } from '../middleware/auth';
import { cacheMiddleware } from '../middleware/cache'; // Import middleware

const router = express.Router();

router.post('/', auth, createBooking);

/**
 * Route: GET /api/bookings/user/:userId
 * Áp dụng Cache:
 * - Key prefix: 'user_bookings'
 * - Key thực tế trong Redis sẽ là: user_bookings:/api/bookings/user/USR001
 */
router.get('/user/:userId', cacheMiddleware('user_bookings'), getUserBookings);

router.get('/:id', getBookingById);

export default router;