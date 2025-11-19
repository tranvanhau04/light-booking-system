import { 
  Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany 
} from 'sequelize-typescript';
import { User } from './User';
import { FlightBooking } from './FlightBooking';
import { Flight } from './Flight';
import { BookingPassenger } from './BookingPassenger';
import { SeatSelection } from './SeatSelection';
import { Baggage } from './Baggage';
import { Payment } from './Payment';

@Table({ 
  tableName: 'Booking', 
  timestamps: true,           // Bật tính năng timestamp
  createdAt: 'bookingDate',   // <-- Định nghĩa: bookingDate chính là createdAt
  updatedAt: false            // <-- Tắt updatedAt vì DB không có cột này
}) 
export class Booking extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  bookingId!: string;

  // Sequelize sẽ tự động quản lý cột này khi tạo mới
  @Column(DataType.DATE)
  bookingDate?: Date;

  @Column(DataType.DOUBLE)
  totalPrice?: number;

  @Column(DataType.STRING(10))
  status?: string;

  @ForeignKey(() => User)
  @Column(DataType.STRING(10))
  userId?: string;

  @BelongsTo(() => User)
  user?: User;

  @BelongsToMany(() => Flight, () => FlightBooking)
  flights?: Flight[]; 

  @HasMany(() => FlightBooking)
  flightBookings?: FlightBooking[];

  @HasMany(() => BookingPassenger)
  bookingPassengers?: BookingPassenger[];

  @HasMany(() => SeatSelection)
  seatSelections?: SeatSelection[];

  @HasMany(() => Baggage)
  baggages?: Baggage[];

  @HasMany(() => Payment)
  payments?: Payment[];
}
export default Booking;