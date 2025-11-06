import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { CabinClass } from './CabinClass';
import { Flight } from './Flight';

@Table({ tableName: 'FlightCabinClass', timestamps: false })
export class FlightCabinClass extends Model {
  @ForeignKey(() => CabinClass)
  @Column
  cabinId!: string;

  @ForeignKey(() => Flight)
  @Column
  flightId!: string;
}
export default FlightCabinClass;