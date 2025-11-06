import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Flight } from './Flight';
import { Booking } from './Booking';

@Table({ tableName: 'FlightBooking', timestamps: false })
export class FlightBooking extends Model {
  @ForeignKey(() => Flight)
  @Column
  flightId!: string;

  @ForeignKey(() => Booking)
  @Column
  bookingId!: string;
}
export default FlightBooking;