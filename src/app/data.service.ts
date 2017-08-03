import {Injectable, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Trip} from './trip';
import {Driver} from './driver';
import {Observable} from 'rxjs/Observable';
import {Vehicle} from './vehicle';
import 'rxjs/add/operator/do';
import {NgbUtility} from './ngb-date-utility';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Utility} from './utility';

@Injectable()
export class DataStore implements OnInit {
  private drivers$: FirebaseListObservable<Driver[]>;
  private vehicles$: FirebaseListObservable<Vehicle[]>;
  private trips$: FirebaseListObservable<Trip[]>;

  constructor(private db: AngularFireDatabase, private ngbUtility: NgbUtility) {
    this.drivers$ = this.db.list('/drivers');
    this.vehicles$ = this.db.list('/vehicles');
    this.trips$ = this.db.list('/trips');
  }

  ngOnInit(): void {
  }

  getTrips(from: NgbDateStruct, to?: NgbDateStruct): Observable<Trip[]> {
    const fromDate = this.ngbUtility.toJSDate(from);
    const toDate = (to) ? this.ngbUtility.toJSDate(to) : new Date(fromDate);
    toDate.setHours(24, 0, 0, 0); // midnight day after

    return this.db.list('/trips', {
      query: {
        startAt: {key: 'start', value: fromDate.getTime() - 1},
        endAt: {key: 'start', value: toDate.getTime() - 1},
        orderByChild: 'start'
      }
    }).do(ts => ts.forEach(t => {
      t.start = new Date(t.start);
      t.end = (t.end) ? new Date(t.end) : null;
    }));
  }

  addTrip(start: Date, end: Date, name: string, description: string, drivers: Driver[], vehicles: Vehicle[]) {
    const trip = {
      start: start.getTime(),
      end: (end) ? end.getTime() : null,
      name,
      description: description || '',
      drivers: drivers || [],
      vehicles: vehicles || []
    };
    return this.trips$.push(trip);
  }

  updateTrip(trip: Trip, updates: any) {
    if (updates.start) updates.start = updates.start.getTime();
    if (updates.end) updates.end = updates.end.getTime();
    return this.trips$.update(trip.$key, updates);
  }

  removeTrip(trip: Trip) {
    return this.trips$.remove(trip);
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.drivers$
      .map(Utility.sortByDisplayName)
      .do(ds => ds.forEach(d => {
        if (d.birthday) d.birthday = new Date(d.birthday);
      }));
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
    return this.vehicles$
      .map(Utility.sortByDisplayName)
      .do(ds => ds.forEach(d => {
        if (d.latestInspection) d.latestInspection = new Date(d.latestInspection);
      }));
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
