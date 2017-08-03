import {Injectable, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Trip} from './trip';
import {Driver} from './driver';
import {Observable} from 'rxjs/Observable';
import {Vehicle} from './vehicle';
import {NgbUtility} from './ngb-date-utility';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Utility} from './utility';
import {Template} from 'app/template';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';
import {Moment} from 'moment';
import * as moment from 'moment';

@Injectable()
export class DataStore implements OnInit {
  private drivers$: FirebaseListObservable<Driver[]>;
  private vehicles$: FirebaseListObservable<Vehicle[]>;
  private trips$: FirebaseListObservable<Trip[]>;
  private templates$: FirebaseListObservable<Template[]>;

  constructor(private db: AngularFireDatabase, private ngbUtility: NgbUtility) {
    this.drivers$ = this.db.list('/drivers');
    this.vehicles$ = this.db.list('/vehicles');
    this.trips$ = this.db.list('/trips');
    this.templates$ = this.db.list('/templates');
  }

  ngOnInit(): void {
  }

  getTrips(from: NgbDateStruct, to?: NgbDateStruct): Observable<Trip[]> {
    const fromDate = this.ngbUtility.toMoment(from);
    const toDate = (to) ? this.ngbUtility.toMoment(to) : moment(fromDate);
    toDate.add(1, 'days');

    return this.db.list('/trips', {
      query: {
        startAt: {value: fromDate.valueOf()},
        endAt: {value: toDate.valueOf() - 1},
        orderByChild: 'start'
      }
    }).do(ts => ts.forEach(t => {
      t.start = moment(t.start);
      t.end = (t.end) ? moment(t.end) : null;
    }));
  }

  addTrip(trip: { start: Moment, end: Moment, name: string, description: string, drivers: Driver[], vehicles: Vehicle[] }) {
    return this.trips$.push({
      start: trip.start.valueOf(),
      end: (trip.end) ? trip.end.valueOf() : null,
      name: trip.name,
      description: trip.description || '',
      drivers: trip.drivers || [],
      vehicles: trip.vehicles || []
    });
  }

  updateTrip(trip: Trip, updates: any) {
    if (updates.start) updates.start = updates.start.valueOf();
    if (updates.end) updates.end = updates.end.valueOf();
    return this.trips$.update(trip.$key, updates);
  }

  removeTrip(trip: Trip) {
    return this.trips$.remove(trip);
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.drivers$
      .map(Utility.sortByDisplayName)
      .do(ds => ds.forEach(d => {
        if (d.birthday) d.birthday = moment(d.birthday);
      }));
  }

  addDriver(displayName: string, name: string, birthday: Moment) {
    const driver = {displayName, name, birthday: (birthday) ? birthday.valueOf() : null, deleted: false};
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

  addVehicle(displayName: string, brand: string, regNo: string, latestInspection: Moment) {
    const vehicle = {
      displayName,
      brand,
      regNo,
      latestInspection: (latestInspection) ? latestInspection.valueOf() : null,
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

  getAllTemplates(): Observable<Template[]> {
    return this.templates$;
  }

  addTemplate(name: string) {
    return this.templates$.push({name: name});
  }

  removeTemplate(template: Template) {
    const tripsInTemplate = this.db.list(`/tripsInTemplate/${template.$key}`).remove();
    this.templates$.remove(template);
  }

  addTripToTemplate(template: Template, trip: Trip) {
    const tripsInTemplate = this.db.list(`/tripsInTemplate/${template.$key}`);
    return tripsInTemplate.push({
      start: trip.start.valueOf(),
      end: (trip.end) ? trip.end.valueOf() : null,
      name: trip.name,
      description: trip.description || '',
      drivers: trip.drivers || [],
      vehicles: trip.vehicles || []
    });
  }

  updateTripFromTemplate(template: Template, trip: Trip, updates: any) {
    if (updates.start) updates.start = updates.start.valueOf();
    if (updates.end) updates.end = updates.end.valueOf();
    const tripsInTemplate = this.db.list(`/tripsInTemplate/${template.$key}`);
    return tripsInTemplate.update(trip.$key, updates);
  }

  removeTripFromTemplate(template: Template, trip: Trip) {
    return this.db.object(`/tripsInTemplate/${template.$key}/${trip.$key}`).remove();
  }

  insertTemplate(date: Moment, templateKey: string) {
    this.db.list(`/tripsInTemplate/${templateKey}`).first().subscribe(trips => {
      trips.forEach(t => {
        if (t.start) {
          t.start = moment(t.start);
          Utility.copyDate(date, t.start);
        }
        if (t.end) {
          t.end = moment(t.end);
          Utility.copyDate(date, t.end);
        }
        this.addTrip(t);
      })
    });

  }

  getTemplateTrips(template: Template): Observable<Trip[]> {
    return this.db.list(`/tripsInTemplate/${template.$key}`, {
      query: {
        orderByChild: 'start'
      }
    }).do(ts => ts.forEach(t => {
        t.start = moment(t.start);
        t.end = (t.end) ? moment(t.end) : null;
      }));
  }
}
