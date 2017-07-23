export interface Trip {
  id: number;
  start: Date;
  end: Date;
  name: string;
  description: string;
  driverIDs: number[];
  vehicleIDs: number[];
}
