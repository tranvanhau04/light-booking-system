import { Request, Response } from 'express'; // <-- Thêm import này
import { Flight } from '../models/Flight';
import { FlightCabinClass } from '../models/FlightCabinClass';
import { CabinClass } from '../models/CabinClass';

/**
 * Lấy chi tiết một chuyến bay, bao gồm cả thông tin
 * hạng vé (CabinClass) và bản đồ ghế (seatMap).
 */
export const getFlightDetails = async (req: Request, res: Response) => {
  try {
    const flightId = req.params.id; // Lấy ID từ URL (ví dụ: /api/flights/FL001)

    const flight = await Flight.findByPk(flightId, {
      include: [
        {
          model: FlightCabinClass,
          include: [CabinClass], // Lấy cả thông tin hạng vé (tên, giá...)
        },
      ],
    });

    if (!flight) {
      return res.status(404).json({ msg: 'Không tìm thấy chuyến bay' });
    }

    // Trả về toàn bộ thông tin chuyến bay,
    // frontend sẽ đọc 'flight.flightCabinClasses[...].seatMap' từ đây
    res.json(flight);

  } catch (err: any) {
    // Dùng console.error để ghi log lỗi ra terminal
    console.error(err.message); 
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// Bạn có thể thêm các hàm khác ở đây (ví dụ: searchFlights)
// export const searchFlights = async (req: Request, res: Response) => {
//   // ... logic tìm kiếm ...
// }