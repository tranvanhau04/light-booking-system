import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'BaggageOption', timestamps: false })
export class BaggageOption extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  optionId!: string;

  @Column(DataType.STRING(20))
  type!: string;

  @Column(DataType.STRING(50))
  weight!: string; // (Tên/Mô tả)

  @Column(DataType.DOUBLE)
  price!: number;
}
export default BaggageOption;