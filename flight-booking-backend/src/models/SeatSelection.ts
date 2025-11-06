import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CabinClass } from './CabinClass';
import { Booking } from './Booking';

@Table({ tableName: 'SeatSelection', timestamps: false })
export class SeatSelection extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  seatId!: string;

  @Column(DataType.STRING(10))
  seatNumber?: string;

  @Column(DataType.STRING(10))
  status?: string;

  @ForeignKey(() => CabinClass)
  @Column(DataType.STRING(10))
  cabinId?: string;

  @ForeignKey(() => Booking)
  @Column(DataType.STRING(10))
  bookingId?: string;

  @BelongsTo(() => CabinClass)
  cabinClass?: CabinClass;

  @BelongsTo(() => Booking)
  booking?: Booking;
}
export default SeatSelection;