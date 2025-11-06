import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { BookingPassenger } from './BookingPassenger';

@Table({ tableName: 'Passenger', timestamps: false })
export class Passenger extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  passengerId!: string;

  @Column(DataType.STRING(50))
  fullName?: string;

  @Column(DataType.STRING(10))
  gender?: string;

  @Column(DataType.DATE)
  dateOfBirth?: Date;

  @Column(DataType.STRING(20))
  nationality?: string;

  @Column(DataType.STRING(20))
  idNumber?: string;

  @HasMany(() => BookingPassenger)
  bookingPassengers?: BookingPassenger[];
}
export default Passenger;