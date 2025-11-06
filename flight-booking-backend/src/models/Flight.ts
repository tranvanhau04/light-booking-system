import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { FlightCabinClass } from './FlightCabinClass';
import { FlightBooking } from './FlightBooking';

@Table({ tableName: 'Flight', timestamps: false })
export class Flight extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  flightId!: string;

  @Column(DataType.STRING(10))
  flightCode!: string;

  @Column(DataType.STRING(20))
  departureAirport!: string;

  @Column(DataType.STRING(20))
  arrivalAirport!: string;

  @Column(DataType.DATE)
  departureTime!: Date;

  @Column(DataType.DATE)
  arrivalTime!: Date;

  @Column(DataType.INTEGER)
  duration?: number;

  @Column(DataType.STRING(20))
  tripType?: string;

  @Column(DataType.STRING(20))
  airline?: string;

  @Column(DataType.DOUBLE)
  basePrice?: number;

  @Column(DataType.INTEGER)
  stopCount?: number;

  @HasMany(() => FlightCabinClass)
  flightCabinClasses?: FlightCabinClass[];

  @HasMany(() => FlightBooking)
  flightBookings?: FlightBooking[];
}
export default Flight;