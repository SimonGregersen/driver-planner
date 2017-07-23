import {Injectable} from '@angular/core';
import {List} from 'immutable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {BackendService} from './backend.service';
import {Driver} from './driver';
import {Trip} from './trip';

@Injectable()
export class DataStore {
  private _drivers: BehaviorSubject<List<Driver>> = new BehaviorSubject(List([]));
  private _trips: BehaviorSubject<List<Trip>> = new BehaviorSubject(List([]));

  public readonly drivers: Observable<List<Driver>> = this._drivers.asObservable();

  constructor(private backendService: BackendService) {
    this.backendService
      .getDrivers()
      .subscribe(drivers => this._drivers.next(drivers), err => console.error('ERROR'));
    this.backendService
      .getTrips()
      .subscribe(trips => this._trips.next(trips), err => console.error('ERROR'));
  }

  getTrips(from: any, to?: any): Observable<List<Trip>> {
    return this._trips.asObservable();
  }

  addTrip(start: Date, end: Date, name: string, description: string, driverIDs: number[], vehicleIDs: number[]) {
    // TODO: id
    const trip = {id: 0, start, end, name, description, driverIDs, vehicleIDs};
    this.backendService
      .addTrip(trip)
      .subscribe(() => this._trips.next(this._trips.getValue().push(trip)));
  }

  getDriver(driverID: number): Driver {
    return this._drivers.getValue().find(d => d.id === driverID);
  }

  addDriver(nickname: string, name: string, birthday: Date) {
    // TODO: id
    const driver = {id: 0, nickname, name, birthday};
    this.backendService
      .addDriver(driver)
      .subscribe(() => this._drivers.next(this._drivers.getValue().push(driver)));
  }

  removeDriver(driver: Driver) {
    this.backendService
      .removeDriver(driver)
      .subscribe(() => {
        const drivers: List<Driver> = this._drivers.getValue();
        const index = drivers.findIndex(d => d.id !== driver.id);
        this._drivers.next(drivers.delete(index));
      });
  }


}
