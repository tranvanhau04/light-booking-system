import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Account } from './Account';
import { Booking } from './Booking';

@Table({ tableName: 'User', timestamps: false })
export class User extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  userId!: string;

  @Column(DataType.STRING(50))
  fullName!: string;

  @Column(DataType.STRING(50))
  email?: string;

  @Column(DataType.STRING(15))
  phone?: string;

  @Column(DataType.DATE)
  dateOfBirth?: Date;

  @Column(DataType.STRING(20))
  nationality?: string;

  @ForeignKey(() => Account)
  @Column(DataType.STRING(20))
  accountId?: string;

  @BelongsTo(() => Account)
  account?: Account;

  @HasMany(() => Booking)
  bookings?: Booking[];
}
export default User;