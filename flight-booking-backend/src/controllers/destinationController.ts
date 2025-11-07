import { Request, Response } from 'express';
import { Flight } from '../models/Flight'; // <-- Dùng model 'Flight'

/**
 * @route   GET /api/destinations/best
 * @desc    Lấy 3 điểm đến từ bảng Flight
 */
export const getBestDestinations = async (req: Request, res: Response) => {
  try {
    // 1. Lấy 3 chuyến bay (ví dụ: 3 chuyến đầu tiên)
    const flights = await Flight.findAll({
      limit: 3,
      order: [['departureTime', 'ASC']] // Sắp xếp theo ngày sớm nhất
    });

    // 2. "Biến đổi" (Transform) data theo yêu cầu của bạn
    const destinations = flights.map(flight => ({
      destinationId: flight.flightId,
      name: flight.arrivalAirport, // <-- Tên là điểm đến
      priceFrom: flight.basePrice,   // <-- Giá gốc
      priceTo: (flight.basePrice || 0) + 50 // <-- Giá + 50
    }));

    res.json(destinations);

  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};