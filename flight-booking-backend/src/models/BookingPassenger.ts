import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Booking } from './Booking';
import { Passenger } from './Passenger';

@Table({ tableName: 'BookingPassenger', timestamps: false })
export class BookingPassenger extends Model {
  @ForeignKey(() => Booking)
  @Column
  bookingId!: string;

  @ForeignKey(() => Passenger)
  @Column
  passengerId!: string;
}
export default BookingPassenger;