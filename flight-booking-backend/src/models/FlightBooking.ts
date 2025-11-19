import {
  Table, Column, Model, ForeignKey, DataType, BelongsTo
} from 'sequelize-typescript';
import { Flight } from './Flight';
import { Booking } from './Booking';

// === FIX CODE: timestamps: false ===
@Table({ tableName: 'FlightBooking', timestamps: false })
export class FlightBooking extends Model {
  
  @ForeignKey(() => Flight)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true,
  })
  flightId!: string;

  @BelongsTo(() => Flight)
  flight!: Flight;

  @ForeignKey(() => Booking)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true,
  })
  bookingId!: string;

  @BelongsTo(() => Booking)
  booking!: Booking;
}
export default FlightBooking;