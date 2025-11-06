// ============================================
// src/models/index.ts
// ============================================
import { Sequelize } from 'sequelize-typescript';

// Import tất cả model
import { Account } from './Account';
import { User } from './User';
import { Flight } from './Flight';
import { CabinClass } from './CabinClass';
import { FlightCabinClass } from './FlightCabinClass';
import { Booking } from './Booking';
import { FlightBooking } from './FlightBooking';
import { Passenger } from './Passenger';
import { BookingPassenger } from './BookingPassenger';
import { SeatSelection } from './SeatSelection';
import { Baggage } from './Baggage';
import { Payment } from './Payment';

// ============================================
// Tạo kết nối Sequelize (chỉ cấu hình, không định nghĩa association)
// ============================================
export const sequelize = new Sequelize({
  database: 'flight_booking',
  username: 'root',
  password: 'sapassword',
  dialect: 'mariadb',
  models: [
    Account,
    User,
    Flight,
    CabinClass,
    FlightCabinClass,
    Booking,
    FlightBooking,
    Passenger,
    BookingPassenger,
    SeatSelection,
    Baggage,
    Payment,
  ],
  logging: false,
});

// ============================================
// Xuất ra tất cả model để dùng ở nơi khác
// ============================================
export {
  Account,
  User,
  Flight,
  CabinClass,
  FlightCabinClass,
  Booking,
  FlightBooking,
  Passenger,
  BookingPassenger,
  SeatSelection,
  Baggage,
  Payment,
};
