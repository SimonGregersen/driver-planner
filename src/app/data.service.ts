import {Injectable, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Trip} from './trip';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {Utility} from './utility';
import {Driver} from './driver';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DataStore implements OnInit {
  public drivers: FirebaseListObservable<Driver[]>;

  constructor(private db: AngularFireDatabase) {
    this.drivers = this.db.list('/drivers');
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
    const trips = this.db.list('/trips');
    trips.push(trip);
  }

  addDriver(displayName: string, name: string, birthday: Date) {
    const driver = {displayName: displayName, name: name, birthday: birthday.getTime()};
    this.drivers.push(driver)
  }

  getDriver(key: string): Observable<Driver> {
    return this.db.object(`/drivers/${key}`);
  }

}
