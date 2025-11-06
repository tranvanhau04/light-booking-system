import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/Account';
import { User } from '../models/User';
import { Flight } from '../models/Flight';
import { CabinClass } from '../models/CabinClass';
import { FlightCabinClass } from '../models/FlightCabinClass';
import { Booking } from '../models/Booking';
import { FlightBooking } from '../models/FlightBooking';
import { Passenger } from '../models/Passenger';
import { BookingPassenger } from '../models/BookingPassenger';
import { SeatSelection } from '../models/SeatSelection';
import { Baggage } from '../models/Baggage';
import { Payment } from '../models/Payment';

export const sequelize = new Sequelize({
  database: 'flight_booking',
  username: 'root',
  password: 'sapassword',
  dialect: 'mariadb',
  logging: false,
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
});


export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ MariaDB connected successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('🛠️ Database synced successfully');
    }
  } catch (error: any) {
    console.error('❌ Unable to connect to MariaDB:', error.message);
    process.exit(1);
  }
};
