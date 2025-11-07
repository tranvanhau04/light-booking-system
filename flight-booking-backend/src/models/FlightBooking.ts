import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Flight } from './Flight';
import { Booking } from './Booking';

@Table({
  tableName: 'FlightBooking',
  timestamps: false, // Bảng này không có cột createdAt/updatedAt
})
export class FlightBooking extends Model {
  
  @ForeignKey(() => Flight)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true, // <-- BÁO RẰNG ĐÂY LÀ 1 PHẦN CỦA KHÓA CHÍNH
  })
  flightId!: string;

  @BelongsTo(() => Flight)
  flight!: Flight;

  @ForeignKey(() => Booking)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true, // <-- BÁO RẰNG ĐÂY LÀ 1 PHẦN CỦA KHÓA CHÍNH
  })
  bookingId!: string;

  @BelongsTo(() => Booking)
  booking!: Booking;
}

export default FlightBooking;