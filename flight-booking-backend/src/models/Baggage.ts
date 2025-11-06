import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Booking } from './Booking';

@Table({ tableName: 'Baggage', timestamps: false })
export class Baggage extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  baggageId!: string;

  @Column(DataType.STRING(10))
  weight?: string;

  @Column(DataType.DOUBLE)
  price?: number;

  @Column(DataType.STRING(10))
  type?: string;

  @ForeignKey(() => Booking)
  @Column(DataType.STRING(10))
  bookingId?: string;

  @BelongsTo(() => Booking)
  booking?: Booking;
}
export default Baggage;