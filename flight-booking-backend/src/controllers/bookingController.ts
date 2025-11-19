import { Request, Response } from 'express';
import { sequelize } from '../config/database'; 
import { Transaction } from 'sequelize';
import { IAuthRequest } from '../middleware/auth';
import redisClient from '../config/redis'; 

// Import Models
import { Flight } from '../models/Flight';
import { FlightCabinClass } from '../models/FlightCabinClass';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { FlightBooking } from '../models/FlightBooking';

const generateId = (prefix: string): string => {
  const num = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${num}`.substring(0, 10);
};

// 1. API TẠO BOOKING (CÓ XÓA CACHE AN TOÀN)
export const createBooking = async (req: IAuthRequest, res: Response) => {
  const t: Transaction = await sequelize.transaction();
  try {
    const { flightId, passengers, selectedSeats, baggage } = req.body;
    const userId = req.user?.userId; 

    if (!userId) throw new Error('User not authenticated');

    const flight = await Flight.findByPk(flightId, {
      include: [{ model: FlightCabinClass }],
      transaction: t, lock: t.LOCK.UPDATE,
    });
    if (!flight) throw new Error('Flight not found');
    let calculatedPrice = flight.basePrice || 0;
    if (baggage?.price) calculatedPrice += baggage.price;

    const newBooking = await Booking.create({
      bookingId: generateId('BK'),
      bookingDate: new Date(),
      totalPrice: calculatedPrice,
      status: 'Success',
      userId: userId,
    }, { transaction: t });

    await Payment.create({
      paymentId: generateId('PM'),
      amount: calculatedPrice,
      status: 'Completed',
      transactionTime: new Date(),
      bankTransactionId: `TXN${Date.now().toString().slice(-8)}`,
      bookingId: newBooking.bookingId,
    }, { transaction: t });

    await FlightBooking.create({
        flightId: flight.flightId,
        bookingId: newBooking.bookingId
    }, { transaction: t });

    await t.commit();

    // === FAIL-SAFE: CHỈ XÓA CACHE NẾU REDIS ĐANG CHẠY ===
    if (redisClient.isOpen) {
        const cacheKey = `user_bookings:/api/bookings/user/${userId}`;
        try {
            await redisClient.del(cacheKey);
            console.log(`🗑️ [CACHE INVALIDATE] Deleted key: ${cacheKey}`);
        } catch (cacheErr) {
            console.error('Error clearing cache:', cacheErr);
        }
    }
    // =====================================================

    res.status(201).json(newBooking);

  } catch (err: any) {
    await t.rollback();
    console.error('Create Booking Error:', err);
    res.status(400).json({ msg: 'Failed to create booking', error: err.message });
  }
};

// 2. API LẤY LỊCH SỬ
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.findAll({
      where: { userId: userId },
      include: [
        {
          model: Flight,
          through: { attributes: [] },
          required: false 
        }
      ],
      order: [['bookingDate', 'DESC']]
    });

    if (!bookings) return res.status(200).json([]);
    res.status(200).json(bookings);
  } catch (error: any) {
    console.error('Get User Bookings Error:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
    res.status(501).json({ message: "Not implemented yet" });
};