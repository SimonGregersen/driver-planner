import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {List} from 'immutable';
import {NAMES} from '../assets/drivers';
import {Driver} from './driver';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import {Trip} from './trip';
import randomSentence from 'random-sentence';

@Injectable()
export class BackendService {
  private drivers: Driver[];
  private trips: Trip[];

  constructor() {
    let i = 0;
    this.drivers = NAMES.map(name => ({id: i++, firstName: name, lastName: ''}));
  }

  getDrivers(): Observable<List<Driver>> {
    return Observable.of(List(this.drivers));
  }

  addDriver(driver: Driver): Observable<List<Driver>> {
    this.drivers.push(driver);
    return Observable.of(List(this.drivers));
  }

  removeDriver(driver: Driver): Observable<List<Driver>> {
    this.drivers = this.drivers.filter(d => d.id !== driver.id);
    return Observable.of(List(this.drivers));
  }

  addTrip(trip: Trip): Observable<List<Trip>> {
    // TODO: id
    this.trips.push(trip);
    return Observable.of(List(this.trips));
  }

  getTrips(): Observable<List<Trip>> {
    if (!this.trips) {
      this.trips = [];
      const date = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
      for (let i = 0; i < 20; i++) {
        const thisDate = new Date(date.getTime());
        thisDate.setHours(Math.floor(Math.random() * 60));
        thisDate.setMinutes(Math.floor(Math.random() * 60));
        this.trips.push(<Trip>{
          id: i,
          start: thisDate,
          end: thisDate,
          name: <string>randomSentence({min: 2, max: 3}),
          driverIDs: [Math.floor(Math.random() * 9)],
          description: <string>randomSentence({min: 0, max: 20})
        });
      }
      this.trips.sort((a, b) => {
        if (a.start < b.start) {
          return -1;
        } else if (a.start > b.start) {
          return 1;
        }
        return 0;
      });
    }

    return Observable.of(List(this.trips));
  }
}
