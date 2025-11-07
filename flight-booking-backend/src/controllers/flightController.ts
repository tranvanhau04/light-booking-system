// src/controllers/flight.controller.ts
import { Request, Response } from 'express';
import { Flight } from '../models/Flight';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

/**
 * Lấy tất cả chuyến bay
 */
export const getAllFlights = async (req: Request, res: Response) => {
  try {
    const flights = await Flight.findAll();
    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách chuyến bay thành công',
      data: flights,
    });
  } catch (error: any) {
    console.error('❌ Lỗi khi lấy chuyến bay:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

/**
 * Tìm kiếm chuyến bay nhiều chặng (multi-city)
 */
export const searchMultiCityFlights = async (req: Request, res: Response) => {
  try {
    const { routes } = req.body; 
    // routes: [{ from: "HCM", to: "SIN", departDate: "2025-12-10" }, { from: "SIN", to: "TYO", departDate: "2025-12-12" }]

    if (!routes || !Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin các chặng bay (routes)',
      });
    }

    const allResults: any[] = [];

    for (const [index, route] of routes.entries()) {
      const { from, to, departDate } = route;

      if (!from || !to || !departDate) {
        return res.status(400).json({
          success: false,
          message: `Thiếu dữ liệu ở chặng ${index + 1}`,
        });
      }

      const startOfDay = new Date(departDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(departDate);
      endOfDay.setHours(23, 59, 59, 999);

      const flights = await Flight.findAll({
        where: {
          departureAirport: { [Op.like]: `%${from}%` },
          arrivalAirport: { [Op.like]: `%${to}%` },
          departureTime: { [Op.between]: [startOfDay, endOfDay] },
        },
        order: [['departureTime', 'ASC']],
      });

      allResults.push({
        route: `${from} → ${to}`,
        date: departDate,
        flights,
        totalFound: flights.length,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tìm kiếm nhiều chặng thành công',
      totalSegments: allResults.length,
      results: allResults,
    });

  } catch (error: any) {
    console.error('❌ Lỗi khi tìm kiếm multi-city:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm multi-city',
    });
  }
};

/**
 * Tìm kiếm chuyến bay với bộ lọc
 */
export const searchFlights = async (req: Request, res: Response) => {
  try {
    const {
      from,
      to,
      departDate,
      returnDate,
      passengers = 1,
      cabinClass,
      tripType = 'one-way'
    } = req.query;

    console.log('🔍 Tham số tìm kiếm nhận được:', {
      from,
      to,
      departDate,
      returnDate,
      passengers,
      cabinClass,
      tripType
    });

    // Kiểm tra các trường bắt buộc
    if (!from || !to || !departDate) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: from, to, departDate',
      });
    }

    // Trích xuất tên sân bay từ định dạng "London City (LCY)" hoặc "London City"
    const extractAirportName = (location: string): string => {
      // Nếu có định dạng "City (CODE)", lấy phần tên trước dấu ngoặc
      const match = location.match(/^(.+?)\s*\(/);
      if (match) {
        return match[1].trim();
      }
      // Nếu chỉ có tên, trả về luôn
      return location.trim();
    };

    const fromAirport = extractAirportName(from as string);
    const toAirport = extractAirportName(to as string);

    console.log('📍 Tên sân bay:', { fromAirport, toAirport });

    // Phân tích ngày từ định dạng "Fri, Jul 14" hoặc "2025-07-14"
    const parseDateString = (dateStr: string): Date => {
      const monthMap: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };

      // Thử phân tích định dạng "Fri, Jul 14"
      const dateMatch = dateStr.match(/([A-Za-z]{3}),?\s+([A-Za-z]{3})\s+(\d{1,2})/);
      if (dateMatch) {
        const [, , month, day] = dateMatch;
        const currentYear = 2025;
        const monthNum = monthMap[month];
        const parsedDate = new Date(currentYear, monthNum, parseInt(day));
        console.log(`Phân tích "${dateStr}" thành:`, parsedDate.toISOString());
        return parsedDate;
      }

      // Dự phòng cho định dạng ISO
      const fallbackDate = new Date(dateStr);
      console.log(`Phân tích ngày ISO "${dateStr}" thành:`, fallbackDate.toISOString());
      return fallbackDate;
    };

    const searchDate = parseDateString(departDate as string);
    
    // Lấy đầu và cuối ngày (00:00:00 đến 23:59:59)
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log('📅 Khoảng thời gian tìm kiếm chuyến đi:', {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString()
    });

    // Xây dựng điều kiện truy vấn
    const whereConditions: any = {
      departureAirport: {
        [Op.like]: `%${fromAirport}%`
      },
      arrivalAirport: {
        [Op.like]: `%${toAirport}%`
      },
      departureTime: {
        [Op.between]: [startOfDay, endOfDay]
      }
    };

    console.log('🔎 Điều kiện truy vấn chuyến đi:', JSON.stringify(whereConditions, null, 2));

    // Tìm kiếm chuyến bay đi
    const outboundFlights = await Flight.findAll({
      where: whereConditions,
      order: [['departureTime', 'ASC']]
    });

    console.log(`✈️ Tìm thấy ${outboundFlights.length} chuyến bay đi`);
    if (outboundFlights.length > 0) {
      console.log('Chuyến bay đầu tiên:', {
        flightCode: outboundFlights[0].flightCode,
        from: outboundFlights[0].departureAirport,
        to: outboundFlights[0].arrivalAirport,
        time: outboundFlights[0].departureTime
      });
    }

    let returnFlights: any[] = [];

    // Nếu là khứ hồi, tìm kiếm chuyến bay về
    if (tripType === 'round-trip' && returnDate) {
      const returnSearchDate = parseDateString(returnDate as string);
      const returnStartOfDay = new Date(returnSearchDate);
      returnStartOfDay.setHours(0, 0, 0, 0);
      
      const returnEndOfDay = new Date(returnSearchDate);
      returnEndOfDay.setHours(23, 59, 59, 999);

      console.log('📅 Khoảng thời gian tìm kiếm chuyến về:', {
        returnStartOfDay: returnStartOfDay.toISOString(),
        returnEndOfDay: returnEndOfDay.toISOString()
      });

      const returnWhereConditions: any = {
        departureAirport: {
          [Op.like]: `%${toAirport}%`
        },
        arrivalAirport: {
          [Op.like]: `%${fromAirport}%`
        },
        departureTime: {
          [Op.between]: [returnStartOfDay, returnEndOfDay]
        }
      };

      console.log('🔎 Điều kiện truy vấn chuyến về:', JSON.stringify(returnWhereConditions, null, 2));

      returnFlights = await Flight.findAll({
        where: returnWhereConditions,
        order: [['departureTime', 'ASC']]
      });

      console.log(`🔙 Tìm thấy ${returnFlights.length} chuyến bay về`);
      if (returnFlights.length > 0) {
        console.log('Chuyến bay về đầu tiên:', {
          flightCode: returnFlights[0].flightCode,
          from: returnFlights[0].departureAirport,
          to: returnFlights[0].arrivalAirport,
          time: returnFlights[0].departureTime
        });
      }
    }

    // Định dạng phản hồi
    const response: any = {
      success: outboundFlights.length > 0,
      message: outboundFlights.length > 0 ? 'Tìm kiếm chuyến bay thành công' : 'Không tìm thấy chuyến bay phù hợp',
      data: {
        searchCriteria: {
          from: fromAirport,
          to: toAirport,
          departDate: departDate,
          returnDate: returnDate || null,
          passengers: passengers,
          cabinClass: cabinClass || 'Economy',
          tripType: tripType
        },
        outboundFlights: outboundFlights.map(flight => ({
          ...flight.toJSON(),
          availableSeats: 150, // Giá trị mặc định
          pricePerSeat: flight.basePrice || 0
        })),
        returnFlights: returnFlights.map(flight => ({
          ...flight.toJSON(),
          availableSeats: 150,
          pricePerSeat: flight.basePrice || 0
        })),
        totalResults: outboundFlights.length + returnFlights.length
      }
    };

    return res.status(200).json(response);

  } catch (error: any) {
    console.error('❌ Lỗi khi tìm kiếm chuyến bay:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm chuyến bay',
      error: error.message
    });
  }
};

/**
 * Lấy chuyến bay theo ID
 */

import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

// ================================
// GET /api/flights/:id
// ================================
export const getFlightById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 🔹 Lấy thông tin chuyến bay theo flightId
    const [flight]: any = await sequelize.query(
      'SELECT * FROM Flight WHERE flightId = ?',
      {
        replacements: [id],
        type: QueryTypes.SELECT,
      }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay',
      });
    }

    // 🔹 Format thời gian, thời lượng
    const formatTime = (time: Date) =>
      new Date(time).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    const durationStr = `${Math.floor(flight.duration / 60)}h ${
      flight.duration % 60
    }m`;

    // 🔹 Tạo outbound (chiều đi)
    const outbound = {
      departureCity: flight.departureAirport,
      arrivalCity: flight.arrivalAirport,
      departureTime: formatTime(flight.departureTime),
      arrivalTime: formatTime(flight.arrivalTime),
      duration: durationStr,
      airline: flight.airline,
      flightNumber: flight.flightCode,
      stops: flight.stopCount,
      amenities: {
        seatPitch: '31 in',
        meal: 'Included',
        wifi: 'Available',
        power: 'Yes',
        entertainment: 'On demand',
      },
    };

    // 🔹 Nếu là round-trip, tạo thêm inbound (chiều về)
    let inbound = null;
    if (flight.tripType === 'Round Trip') {
      inbound = {
        departureCity: flight.arrivalAirport,
        arrivalCity: flight.departureAirport,
        departureTime: '09:00 PM',
        arrivalTime: '09:00 AM',
        duration: '7h 00m',
        airline: flight.airline,
        flightNumber: `${flight.flightCode}-R`,
        stops: 0,
      };
    }

    // 🔹 Mock hành lý (baggage)
    const baggage = {
      included: {
        type: 'Checked bag (23kg)',
        note: 'Included for each passenger',
      },
      extra: [
        { type: 'Extra bag (23kg)', price: 85.0, status: 'Available' },
        { type: 'Sports equipment', price: 120.0, status: 'Available' },
      ],
    };

    // 🔹 Dữ liệu trả về cho frontend
    const response = {
      id: flight.flightId,
      origin: flight.departureAirport,
      destination: flight.arrivalAirport,
      dateRange: 'Nov 10 - Nov 17', // mock để frontend test UI
      travellers: 1,
      cabinClass: 'Economy',
      tripType: flight.tripType,
      totalPrice: flight.basePrice,
      outbound,
      inbound,
      baggage,
    };

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin chuyến bay thành công',
      data: response,
    });
  } catch (error) {
    console.error('❌ Lỗi khi lấy chuyến bay:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chuyến bay',
    });
  }
};
