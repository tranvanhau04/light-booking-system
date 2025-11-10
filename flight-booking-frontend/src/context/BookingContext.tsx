import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BackendFlight } from '../services/flightService'; // <-- Giữ nguyên import này

// Định nghĩa dữ liệu mà chúng ta cần thu thập
interface BookingData {
  outboundFlight?: BackendFlight; 
  inboundFlight?: BackendFlight; 
  passengers: any[];
  selectedSeats: any[];
  baggage?: any;
  protection: boolean;
  totalPrice: number;
  passengersData?: any; 
  searchCriteria?: any;
  selectedBaggage?: any; // <-- ĐÂY LÀ KHỐI MÀ BẠN GỬI
}

// Định nghĩa những gì Context sẽ cung cấp
interface IBookingContext {
  bookingData: BookingData;
  setBookingData: (updates: Partial<BookingData>) => void; // <-- THÊM HÀM SETTER CHUNG
  setPassengerData: (passengers: any[]) => void;
  setSelectedSeatsData: (seats: any[]) => void;
  setBaggageData: (baggage: any) => void;
  setProtectionData: (protection: boolean) => void;
  clearBookingData: () => void;
}

// Giá trị khởi tạo
const initialState: BookingData = {
  passengers: [],
  selectedSeats: [],
  protection: false,
  totalPrice: 0, // Khởi tạo bằng 0
};

// Tạo Context
const BookingContext = createContext<IBookingContext | undefined>(undefined);

// Tạo "Nhà cung cấp" (Provider)
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialState);

 // HÀM SETTER CHUNG (để FlightDetailsScreen có thể lưu mọi thứ)
  const setBookingUpdates = (updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }));
  };

  const setPassengerData = (passengers: any[]) =>
    setBookingData((prev) => ({ ...prev, passengers }));

  // (Chúng ta sẽ sửa hàm này ở bước sau để nó "thêm" ghế, không "thay thế")
  const setSelectedSeatsData = (seats: any[]) =>
    setBookingData((prev) => ({ ...prev, selectedSeats: seats }));

  const setBaggageData = (baggage: any) =>
    setBookingData((prev) => ({ ...prev, baggage }));

  const setProtectionData = (protection: boolean) =>
    setBookingData((prev) => ({ ...prev, protection }));

  const clearBookingData = () => setBookingData(initialState);

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData: setBookingUpdates, // <-- CUNG CẤP HÀM SETTER CHUNG
        setPassengerData,
        setSelectedSeatsData,
        setBaggageData,
        setProtectionData,
        clearBookingData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Hook (Giữ nguyên)
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking phải được dùng bên trong BookingProvider');
  }
  return context;
};