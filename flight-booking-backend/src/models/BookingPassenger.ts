import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Booking } from './Booking';
import { Passenger } from './Passenger';

@Table({
  tableName: 'BookingPassenger',
  timestamps: false, // Bảng này không có cột createdAt/updatedAt
})
export class BookingPassenger extends Model {
  
  @ForeignKey(() => Booking)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true, // <-- BÁO RẰNG ĐÂY LÀ 1 PHẦN CỦA KHÓA CHÍNH
  })
  bookingId!: string;

  @BelongsTo(() => Booking)
  booking!: Booking;

  @ForeignKey(() => Passenger)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true, // <-- BÁO RẰNG ĐÂY LÀ 1 PHẦN CỦA KHÓA CHÍNH
  })
  passengerId!: string;

  @BelongsTo(() => Passenger)
  passenger!: Passenger;
}

export default BookingPassenger;