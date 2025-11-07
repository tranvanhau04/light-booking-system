import axios from 'axios';

export interface Flight {
  id: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  departureAirportName: string;
  arrivalAirport: string;
  arrivalAirportName: string;
  departureCity: string;
  arrivalCity: string;
  airline: string;
  flightNumber: string;
  duration: string;
  stops: number;
  stopsText: string;
  price: number;
  icon: string;
  iconColor: string;
  date: string;
  departureDate?: string;
  arrivalDate?: string;
  amenities?: {
    seatPitch: string;
    meal: string;
    wifi: string;
    power: string;
    entertainment: string;
  };
}

export interface Baggage {
  included: {
    type: string;
    note: string;
  };
  extra: Array<{
    type: string;
    price: number;
    status: string;
  }>;
}

export interface FlightSearchParams {
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
  travellers?: number;
  cabinClass?: string;
}

export interface FlightDetails {
  id: string;
  destination: string;
  origin: string;
  dateRange: string;
  travellers: number;
  cabinClass: string;
  tripType: string;
  outbound: Flight;
  inbound: Flight | null;
  baggage: Baggage;
  totalPrice: number;
}

const API_BASE_URL = 'http://localhost:8080/api/flights'; // ⚙️ đổi theo backend thật của bạn
const BAGGAGE_API_URL = 'http://localhost:8080/api/baggage'; // nếu có bảng baggage riêng

class FlightService {
  /**
   * Get all flights
   */
  async getAllFlights(): Promise<Flight[]> {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  }

  /**
   * Search flights from backend with query params
   */
  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        from: params.from,
        to: params.to,
        departDate: params.departDate,
        returnDate: params.returnDate,
        travellers: params.travellers,
        cabinClass: params.cabinClass,
      },
    });
    return response.data;
  }

  /**
   * Get flight details from backend
   */
  async getFlightDetails(flightId: string, searchParams: FlightSearchParams): Promise<FlightDetails | null> {
    try {
      // Gọi API để lấy flight detail
      const response = await axios.get(`${API_BASE_URL}/${flightId}`);
      const outboundFlight: Flight = response.data;

      // Nếu có return date → tìm chiều ngược lại
      let inboundFlight: Flight | null = null;
      if (searchParams.returnDate) {
        const inboundResponse = await axios.get(`${API_BASE_URL}/search`, {
          params: {
            from: outboundFlight.arrivalCity,
            to: outboundFlight.departureCity,
            departDate: searchParams.returnDate,
          },
        });
        inboundFlight = inboundResponse.data?.[0] || null;
      }

      // Lấy thông tin baggage (nếu có bảng riêng)
      let baggageInfo: Baggage = {
        included: { type: "Cabin bag 7kg", note: "1 per passenger" },
        extra: [
          { type: "Checked bag 20kg", price: 40, status: "Available" },
          { type: "Checked bag 30kg", price: 60, status: "Available" },
        ],
      };
      try {
        const baggageResponse = await axios.get(BAGGAGE_API_URL);
        if (baggageResponse.data) baggageInfo = baggageResponse.data;
      } catch (bErr) {
        console.warn("⚠️ No baggage API found, using default data");
      }

      const from = searchParams.from?.split(' (')[0] || outboundFlight.departureCity;
      const to = searchParams.to?.split(' (')[0] || outboundFlight.arrivalCity;

      return {
        id: flightId,
        destination: to,
        origin: from,
        dateRange: searchParams.returnDate
          ? `${searchParams.departDate} - ${searchParams.returnDate}`
          : searchParams.departDate || 'N/A',
        travellers: searchParams.travellers || 1,
        cabinClass: searchParams.cabinClass || 'Economy',
        tripType: searchParams.returnDate ? 'Round-trip' : 'One-way',
        outbound: outboundFlight,
        inbound: inboundFlight,
        baggage: baggageInfo,
        totalPrice: inboundFlight
          ? outboundFlight.price + inboundFlight.price
          : outboundFlight.price,
      };
    } catch (error) {
      console.error('Error fetching flight details:', error);
      return null;
    }
  }

  /**
   * Get baggage information
   */
  async getBaggageInfo(): Promise<Baggage> {
    try {
      const response = await axios.get(BAGGAGE_API_URL);
      return response.data;
    } catch {
      return {
        included: { type: 'Cabin bag 7kg', note: '1 per passenger' },
        extra: [
          { type: 'Checked bag 20kg', price: 40, status: 'Available' },
          { type: 'Checked bag 30kg', price: 60, status: 'Available' },
        ],
      };
    }
  }
}

export const flightService = new FlightService();
export default flightService;
