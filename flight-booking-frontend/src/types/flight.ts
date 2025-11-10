// types/flight.ts

export interface FlightAmenities {
  seatPitch: string;
  meal: string;
  wifi: string;
  power: string;
  entertainment: string;
}

export interface FlightSegment {
  from: string;
  to: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date?: string;
  departureDate?: string;
  arrivalDate?: string;
  stops: number;
  duration: string;
  amenities?: FlightAmenities;
}

export interface BaggageIncluded {
  type: string;
  note: string;
}

export interface BaggageExtra {
  type: string;
  price: number;
  status: string;
}

export interface Baggage {
  included: BaggageIncluded;
  extra: BaggageExtra[];
}

export interface FlightDetails {
  id: string;
  destination: string;
  origin: string;
  dateRange: string;
  travellers: number;
  cabinClass: string;
  tripType: string;
  outbound: FlightSegment;
  inbound: FlightSegment;
  baggage: Baggage;
  totalPrice: number;
}

// Request/Response types cho API
export interface GetFlightDetailsRequest {
  flightId: string;
}

export interface GetFlightDetailsResponse {
  success: boolean;
  data: FlightDetails;
  message?: string;
}

export interface BookFlightRequest {
  flightId: string;
  travellers: number;
  contactInfo: {
    email: string;
    phone: string;
  };
  passengers: Passenger[];
  extraBaggage?: string[];
}

export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber?: string;
  nationality?: string;
}

export interface BookFlightResponse {
  success: boolean;
  data: {
    bookingId: string;
    totalAmount: number;
    paymentUrl?: string;
  };
  message?: string;
}

// src/types.ts

// (Thêm vào cuối file này)

export interface Flight {
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
}

export interface Itinerary {
    id: string; 
    outboundFlight: Flight;
    returnFlight: Flight | null; 
    totalPrice: number;
}

// (Bạn cũng có thể chuyển các 'types' khác vào đây, ví dụ 'Airport')