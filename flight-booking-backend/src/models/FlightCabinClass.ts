import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { CabinClass } from './CabinClass';
import { Flight } from './Flight';

interface SeatMapItem {
  seatNumber: string;
  isAvailable: boolean;
  price?: number;
}

@Table({ tableName: 'FlightCabinClass', timestamps: false })
export class FlightCabinClass extends Model {
  @ForeignKey(() => CabinClass)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true,
  })
  cabinId!: string;

  @BelongsTo(() => CabinClass)
  cabinClass!: CabinClass; // <-- ĐÃ SỬA LỖI Ở ĐÂY

  @ForeignKey(() => Flight)
  @Column({
    type: DataType.STRING(10),
    primaryKey: true,
  })
  flightId!: string;

  @BelongsTo(() => Flight)
  flight!: Flight; // <-- ĐÃ SỬA LỖI Ở ĐÂY

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  seatMap?: SeatMapItem[];
}

export default FlightCabinClass;