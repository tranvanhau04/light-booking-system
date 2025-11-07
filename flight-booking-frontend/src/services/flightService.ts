import axios from 'axios';

// 10.0.2.2 là localhost khi dùng máy ảo Android.
// Thay bằng IP máy tính của bạn nếu dùng điện thoại thật.
const API_URL = 'http://192.168.1.46:5000/api';

// =================================================================
// INTERFACES MỚI (Khớp với Backend API)
// =================================================================

export interface SeatMapItem {
  seatNumber: string;
  isAvailable: boolean;
  price?: number;
}

export interface BackendCabinClass {
  classId: string;
  className: string;
  priceMultiplier: number;
}

export interface BackendFlightCabinClass {
  cabinId: string;
  flightId: string;
  seatMap: SeatMapItem[] | null;
  cabinClass: BackendCabinClass;
}

export interface BackendFlight {
  flightId: string;
  flightCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string; 
  arrivalTime: string;   
  duration: number;
  airline: string;
  basePrice: number;
  stopCount: number;
  flightCabinClasses?: BackendFlightCabinClass[];
}

export interface FlightSearchParams {
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
  stops?: string;
  airlines?: string[];
  sortBy?: string;
}

// =================================================================
// FLIGHT SERVICE MỚI
// =================================================================

class FlightService {
  /**
   * Tìm kiếm chuyến bay (đã lọc/sắp xếp) từ Backend
   */
  async searchFlights(params: FlightSearchParams): Promise<BackendFlight[]> {
    try {
      const response = await axios.get(`${API_URL}/flights`, {
        params: params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi tìm kiếm chuyến bay:', error.response?.data || error.message);
      throw error; // <-- ĐÃ SỬA LỖI Ở ĐÂY
    }
  }

  /**
   * Lấy chi tiết MỘT chuyến bay (bao gồm cả seatMap)
   */
  async getFlightDetails(flightId: string): Promise<BackendFlight> {
    try {
      const response = await axios.get(`${API_URL}/flights/${flightId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi lấy chi tiết chuyến bay ${flightId}:`, error.response?.data || error.message);
      throw error; // <-- ĐÃ SỬA LỖI Ở ĐÂY
    }
  }
}

// Export singleton instance
export const flightService = new FlightService();
export default flightService;