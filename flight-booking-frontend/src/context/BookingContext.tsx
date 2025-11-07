// src/context/BookingContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BackendFlight } from '../services/flightService';

// Định nghĩa dữ liệu mà chúng ta cần thu thập
interface BookingData {
  outboundFlight?: BackendFlight; // <-- SỬA Ở ĐÂY
  inboundFlight?: BackendFlight;  // <-- THÊM MỚI
  passengers: any[];
  selectedSeats: any[]; // (Sẽ lưu ghế cho cả 2 chuyến)
  baggage?: any;
  protection: boolean;
}

// Định nghĩa những gì Context sẽ cung cấp
interface IBookingContext {
  bookingData: BookingData;
  setFlightData: (outbound: BackendFlight, inbound?: BackendFlight) => void; // <-- SỬA Ở ĐÂY
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
};

// Tạo Context
const BookingContext = createContext<IBookingContext | undefined>(undefined);

// Tạo "Nhà cung cấp" (Provider)
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialState);

  // <-- SỬA HÀM NÀY
  const setFlightData = (outbound: BackendFlight, inbound?: BackendFlight) =>
    setBookingData((prev) => ({ ...prev, outboundFlight: outbound, inboundFlight: inbound }));

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
        setFlightData, // <-- ĐÃ SỬA
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