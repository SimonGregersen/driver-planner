import {Injectable, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Trip} from './trip';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {Utility} from './utility';
import {Driver} from './driver';
import {Observable} from 'rxjs/Observable';
import {Vehicle} from './vehicle';
import 'rxjs/add/operator/map';

@Injectable()
export class DataStore implements OnInit {
  private drivers$: FirebaseListObservable<Driver[]>;
  private vehicles$: FirebaseListObservable<Vehicle[]>;
  private trips: FirebaseListObservable<Trip[]>;

  constructor(private db: AngularFireDatabase) {
    this.drivers$ = this.db.list('/drivers');
    this.vehicles$ = this.db.list('/vehicles');
    this.trips = this.db.list('/trips');
  }

  ngOnInit(): void {
  }

  getTrips(from: NgbDate, to?: NgbDate): Observable<Trip[]> {
    const fromDate = Utility.toJSDate(from);
    const toDate = (to) ? Utility.toJSDate(to) : new Date(fromDate);
    toDate.setHours(24, 0, 0, 0);

    return this.db.list('/trips', {
      query: {
        startAt: {key: 'start', value: fromDate.getTime() - 1},
        endAt: {key: 'start', value: toDate.getTime() - 1},
        orderByChild: 'start'
      }
    });
  }

  addTrip(start: Date, end: Date, name: string, description: string, drivers: any[], vehicles: any[]) {
    const trip = {
      start: start.getTime(),
      end: (end) ? end.getTime() : null,
      name,
      description: description || '',
      drivers: drivers || [],
      vehicles: vehicles || []
    };
    return this.trips.push(trip);
  }

  removeTrip(trip: Trip) {
    return this.trips.remove(trip);
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.drivers$;
  }

  addDriver(displayName: string, name: string, birthday: Date) {
    const driver = {displayName, name, birthday: (birthday) ? birthday.getTime() : null, deleted: false};
    return this.drivers$.push(driver)
  }

  deleteDriver(driver: Driver) {
    return this.drivers$.update(driver.$key, {deleted: true});
  }

  getDriver(key: string): Observable<Driver> {
    return this.db.object(`/drivers/${key}`);
  }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.vehicles$;
  }

  addVehicle(displayName: string, brand: string, regNo: string, latestInspection: Date) {
    const vehicle = {
      displayName,
      brand,
      regNo,
      latestInspection: (latestInspection) ? latestInspection.getTime() : null,
      deleted: false
    };
    this.vehicles$.push(vehicle);
  }

  deleteVehicle(vehicle: Vehicle) {
    return this.vehicles$.update(vehicle.$key, {deleted: true});
  }

  getVehicle(key: string): Observable<Vehicle> {
    return this.db.object(`/vehicles/${key}`);
  }
}
