import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { FlightCabinClass } from './FlightCabinClass';
import { SeatSelection } from './SeatSelection';

@Table({ tableName: 'CabinClass', timestamps: false })
export class CabinClass extends Model {
  @Column({ type: DataType.STRING(10), primaryKey: true })
  classId!: string;

  @Column(DataType.STRING(20))
  className?: string;

  @Column(DataType.DOUBLE)
  priceMultiplier?: number;

  @Column(DataType.INTEGER)
  availableSeats?: number;

  @HasMany(() => FlightCabinClass)
  flightCabinClasses?: FlightCabinClass[];

  @HasMany(() => SeatSelection)
  seatSelections?: SeatSelection[];
}
export default CabinClass;