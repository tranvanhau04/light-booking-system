import flightsData from '../data/flights.json';

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
  amenities: {
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

class FlightService {
  private flights: Flight[] = flightsData.flights;
  private baggageInfo: Baggage = flightsData.baggage;

  /**
   * Get all flights
   */
  getAllFlights(): Flight[] {
    return this.flights;
  }

  /**
   * Search flights based on search parameters
   */
  searchFlights(params: FlightSearchParams): Flight[] {
    let results = [...this.flights];

    // Filter by route if provided
    if (params.from && params.to) {
      const fromCity = params.from.split(' (')[0];
      const toCity = params.to.split(' (')[0];
      
      results = results.filter(flight => 
        flight.departureCity === fromCity && flight.arrivalCity === toCity
      );
    }

    return results;
  }

  /**
   * Get flight by ID
   */
  getFlightById(id: string): Flight | undefined {
    return this.flights.find(flight => flight.id === id);
  }

  /**
   * Get flight details with full information
   */
  getFlightDetails(flightId: string, searchParams: FlightSearchParams): FlightDetails | null {
    const outboundFlight = this.getFlightById(flightId);
    
    if (!outboundFlight) {
      return null;
    }

    // Find return flight if round-trip
    let inboundFlight: Flight | null = null;
    if (searchParams.returnDate) {
      // Find a return flight going opposite direction
      inboundFlight = this.flights.find(flight => 
        flight.departureCity === outboundFlight.arrivalCity &&
        flight.arrivalCity === outboundFlight.departureCity
      ) || null;
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
      baggage: this.baggageInfo,
      totalPrice: inboundFlight 
        ? outboundFlight.price + inboundFlight.price 
        : outboundFlight.price,
    };
  }

  /**
   * Get baggage information
   */
  getBaggageInfo(): Baggage {
    return this.baggageInfo;
  }

  /**
   * Filter flights by stops
   */
  filterByStops(flights: Flight[], stopsFilter: string): Flight[] {
    switch (stopsFilter) {
      case 'Nonstop only':
        return flights.filter(f => f.stops === 0);
      case '1 stop or nonstop':
        return flights.filter(f => f.stops <= 1);
      case 'Any stops':
      default:
        return flights;
    }
  }

  /**
   * Filter flights by airlines
   */
  filterByAirlines(flights: Flight[], airlines: string[]): Flight[] {
    if (airlines.length === 0) {
      return flights;
    }
    return flights.filter(f => airlines.includes(f.airline));
  }

  /**
   * Sort flights
   */
  sortFlights(flights: Flight[], sortBy: string): Flight[] {
    const sorted = [...flights];
    
    switch (sortBy) {
      case 'Price: Low to High':
        return sorted.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'Duration: Shortest':
        return sorted.sort((a, b) => {
          const durationA = this.parseDuration(a.duration);
          const durationB = this.parseDuration(b.duration);
          return durationA - durationB;
        });
      case 'Best':
      default:
        // Best = combination of price and duration
        return sorted.sort((a, b) => {
          const scoreA = a.price + this.parseDuration(a.duration) * 10;
          const scoreB = b.price + this.parseDuration(b.duration) * 10;
          return scoreA - scoreB;
        });
    }
  }

  /**
   * Parse duration string to minutes
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  }
}

// Export singleton instance
export const flightService = new FlightService();
export default flightService;