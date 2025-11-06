import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'Account', timestamps: false })
export class Account extends Model {
  @Column({ type: DataType.STRING(20), primaryKey: true })
  accountId!: string;

  @Column({ type: DataType.STRING(20), allowNull: false, unique: true })
  userName!: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  password!: string;

  @HasOne(() => User)
  user?: User;
}
export default Account;