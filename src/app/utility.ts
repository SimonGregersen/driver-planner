import {Driver} from './driver';
import {Trip} from './trip';

export class Utility {
  static filterDeleted(arr: any[]): any[] {
    return arr.filter(d => !d.deleted);
  }

  static isAssigned(driver: Driver, trip: Trip): boolean {
    const drivers = trip.drivers || [];
    return drivers.includes(driver.$key);
  }

  static sortByDisplayName(arr: any[]): any[] {
    return arr.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

}
