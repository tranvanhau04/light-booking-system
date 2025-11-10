import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import { Flight } from '../models/Flight';
import { FlightCabinClass } from '../models/FlightCabinClass';
import { CabinClass } from '../models/CabinClass';

/**
 * @route   GET /api/flights/:id
 * @desc    Lấy chi tiết một chuyến bay (bao gồm cả seatMap).
 */
export const getFlightDetails = async (req: Request, res: Response) => {
  try {
    const flightId = req.params.id;

    const flight = await Flight.findByPk(flightId, {
      include: [
        {
          model: FlightCabinClass,
          include: [CabinClass],
        },
      ],
    });

    if (!flight) {
      return res.status(404).json({ msg: 'Không tìm thấy chuyến bay' });
    }
    
    res.json(flight);

  } catch (err: any) {
    console.error(err.message); 
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

/**
 * @route   GET /api/flights/airports-from-flights (MỚI)
 * @desc    Lấy danh sách airports từ Flight table với mapping đầy đủ
 */
export const getAirportsFromFlights = async (req: Request, res: Response) => {
  try {
    // 1. Lấy tất cả điểm đi duy nhất
    const departures = await Flight.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('departureAirport')), 'airportName'],
      ],
      raw: true,
    });

    // 2. Lấy tất cả điểm đến duy nhất
    const arrivals = await Flight.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('arrivalAirport')), 'airportName'],
      ],
      raw: true,
    });

    // 3. Gộp và loại bỏ trùng lặp
    const allNames = [...departures, ...arrivals].map(a => (a as any).airportName);
    const uniqueNames = [...new Set(allNames)].filter(name => 
      typeof name === 'string' && name.length > 0
    );

    // 4. Mapping cứng từ tên sân bay -> thông tin đầy đủ
    const airportMapping: Record<string, { code: string; city: string; country: string }> = {
      'London City': { code: 'LCY', city: 'London', country: 'United Kingdom' },
      'John F Kennedy': { code: 'JFK', city: 'New York', country: 'United States' },
      'Hong Kong': { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong' },
      'New York': { code: 'NYC', city: 'New York', country: 'United States' },
      'Los Angeles': { code: 'LAX', city: 'Los Angeles', country: 'United States' },
      'Sydney': { code: 'SYD', city: 'Sydney', country: 'Australia' },
      'Paris CDG': { code: 'CDG', city: 'Paris', country: 'France' },
      'Tokyo Haneda': { code: 'HND', city: 'Tokyo', country: 'Japan' },
      'Singapore': { code: 'SIN', city: 'Singapore', country: 'Singapore' },
      'Bangkok': { code: 'BKK', city: 'Bangkok', country: 'Thailand' }
    };

    // 5. Transform data với mapping
    const airports = uniqueNames.map(name => {
      const info = airportMapping[name] || {
        code: name.substring(0, 3).toUpperCase(),
        city: name.split(' ')[0] || name,
        country: 'Unknown'
      };

      return {
        name: name,
        code: info.code,
        city: info.city,
        country: info.country
      };
    });

    console.log(`✈️ Found ${airports.length} unique airports from Flight table`);

    res.json({
      success: true,
      message: 'Airports fetched successfully from Flight table',
      data: airports
    });

  } catch (err: any) {
    console.error('❌ Error in getAirportsFromFlights:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: err.message 
    });
  }
};

/**
 * @route   GET /api/flights/airports (CŨ - giữ nguyên để backward compatible)
 * @desc    Lấy danh sách sân bay DUY NHẤT từ bảng Flight
 */
export const getUniqueAirports = async (req: Request, res: Response) => {
  try {
    const departures = await Flight.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('departureAirport')), 'airportName'],
      ],
      raw: true,
    });

    const arrivals = await Flight.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('arrivalAirport')), 'airportName'],
      ],
      raw: true,
    });

    const allNames = [...departures, ...arrivals].map(a => (a as any).airportName);
    const uniqueAndValidNames = [...new Set(allNames)].filter(name => {
      return typeof name === 'string' && name.length > 0;
    });

    const airports = uniqueAndValidNames.map(name => ({
      name: name,
      code: name.substring(name.length - 3).toUpperCase(), 
      city: name.split(' ')[0] || name, 
    }));

    res.json({
      success: true,
      message: 'Airports fetched successfully',
      data: airports
    });

  } catch (err: any) {
    console.error("Lỗi trong getUniqueAirports:", err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @route   GET /api/flights/search
 * @desc    Tìm kiếm chuyến bay - Nhận TÊN SÂN BAY từ frontend
 */
export const searchFlights = async (req: Request, res: Response) => {
  try {
    const { from, to, departDate, returnDate, tripType, passengers, cabinClass } = req.query;

    console.log('🔍 Search params received:', { from, to, departDate, returnDate, tripType });

    if (!from || !to || !departDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: from, to, departDate'
      });
    }

    // Frontend gửi TÊN SÂN BAY (ví dụ: "London City"), không cần parse
    const fromAirport = from as string;
    const toAirport = to as string;

    // Parse date từ format "Fri, Jul 14" hoặc "Jul 14" sang Date object
    const parseDate = (dateStr: string): Date | null => {
      try {
        const currentYear = new Date().getFullYear();
        
        // Loại bỏ dấu phẩy và tách chuỗi
        const parts = dateStr.replace(',', '').trim().split(' ');
        
        // Nếu có 3 phần: ["Fri", "Jul", "14"]
        // Nếu có 2 phần: ["Jul", "14"]
        const month = parts[parts.length - 2]; // "Jul"
        const day = parts[parts.length - 1];   // "14"
        
        const dateString = `${month} ${day}, ${currentYear}`; // "Jul 14, 2025"
        const parsed = new Date(dateString);
        
        if (isNaN(parsed.getTime())) {
          console.error(`❌ Invalid date format: ${dateStr}`);
          return null;
        }
        
        return parsed;
      } catch (error) {
        console.error(`❌ Error parsing date: ${dateStr}`, error);
        return null;
      }
    };

    // Parse departure date
    const departDateObj = parseDate(departDate as string);
    if (!departDateObj) {
      return res.status(400).json({
        success: false,
        message: 'Invalid departure date format'
      });
    }

    // Build query cho outbound flights
    const outboundWhere: any = {
      departureAirport: fromAirport,  // So sánh chính xác tên sân bay
      arrivalAirport: toAirport,      // So sánh chính xác tên sân bay
      departureTime: {
        [Op.gte]: new Date(departDateObj.setHours(0, 0, 0, 0)),
        [Op.lte]: new Date(departDateObj.setHours(23, 59, 59, 999)),
      }
    };

    console.log('🔎 Outbound query:', outboundWhere);

    // Tìm chuyến bay đi
    const outboundFlights = await Flight.findAll({ 
      where: outboundWhere,
      order: [['departureTime', 'ASC']]
    });

    console.log(`✈️ Found ${outboundFlights.length} outbound flights`);

    // Tìm chuyến bay về nếu là round-trip
    let returnFlights: Flight[] = [];
    if (tripType === 'round-trip' && returnDate) {
      const returnDateObj = parseDate(returnDate as string);
      
      if (returnDateObj) {
        const returnWhere: any = {
          departureAirport: toAirport,    // Đảo ngược: từ đích về nguồn
          arrivalAirport: fromAirport,    // Đảo ngược
          departureTime: {
            [Op.gte]: new Date(returnDateObj.setHours(0, 0, 0, 0)),
            [Op.lte]: new Date(returnDateObj.setHours(23, 59, 59, 999)),
          }
        };

        console.log('🔎 Return query:', returnWhere);

        returnFlights = await Flight.findAll({ 
          where: returnWhere,
          order: [['departureTime', 'ASC']]
        });

        console.log(`🔙 Found ${returnFlights.length} return flights`);
      }
    }

    // Kiểm tra có kết quả không
    if (outboundFlights.length === 0) {
      return res.json({
        success: false,
        message: 'No flights found for this route and date',
        data: {
          outboundFlights: [],
          returnFlights: [],
          searchCriteria: {
            from: fromAirport,
            to: toAirport,
            departDate,
            returnDate,
            tripType,
            passengers,
            cabinClass
          }
        }
      });
    }

    // Trả về kết quả
    res.json({
      success: true,
      message: 'Flights found successfully',
      data: {
        outboundFlights: outboundFlights,
        returnFlights: returnFlights,
        searchCriteria: {
          from: fromAirport,
          to: toAirport,
          departDate,
          returnDate,
          tripType,
          passengers,
          cabinClass
        }
      }
    });

  } catch (err: any) {
    console.error('❌ Error in searchFlights:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: err.message 
    });
  }
};