import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Driver} from './driver';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {List} from 'immutable';
import {BackendService} from './backend.service';
import {Trip} from './trip';

@Injectable()
export class DataStore {
  private _drivers: BehaviorSubject<List<Driver>> = new BehaviorSubject(List([]));
  private _trips: BehaviorSubject<List<Trip>> = new BehaviorSubject(List([]));

  public readonly drivers: Observable<List<Driver>> = this._drivers.asObservable();
  public readonly trips: Observable<List<Trip>> = this._trips.asObservable();

  constructor(private backendService: BackendService) {
    this.backendService
      .getDrivers()
      .subscribe(drivers => this._drivers.next(drivers), err => console.error('ERROR'));
    this.backendService
      .getTrips()
      .subscribe(trips => this._trips.next(trips), err => console.error('ERROR'));
  }

  addDriver(driver: Driver) {
    this.backendService
      .addDriver(driver)
      .subscribe(_ => this._drivers.next(this._drivers.getValue().push(driver)));
  }

  removeDriver(driver: Driver) {
    this.backendService
      .removeDriver(driver)
      .subscribe(_ => {
        const drivers: List<Driver> = this._drivers.getValue();
        const index = drivers.findIndex(d => d.id !== driver.id);
        this._drivers.next(drivers.delete(index));
      });
  }


}
