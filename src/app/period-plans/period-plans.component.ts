import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbUtility} from '../ngb-date-utility';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {DataStore} from '../data.service';
import {Trip} from '../trip';
import {Subscription} from 'rxjs/Subscription';
import {Driver} from '../driver';
import {Utility} from '../utility';

@Component({
  selector: 'app-driver-plans',
  templateUrl: './period-plans.component.html',
  styleUrls: ['./period-plans.component.css']
})
export class PeriodPlansComponent implements OnDestroy, OnInit {
  hovered: NgbDateStruct;
  from: NgbDateStruct;
  to: NgbDateStruct;
  range: NgbDateStruct[];
  drivers: Driver[];
  trips: Trip[];
  filteredTrips: Trip[];

  private driversSubscription: Subscription;
  private tripsSubscription: Subscription;
  private _selectedDriver: Driver;

  isHovered = date => this.from && !this.to && this.hovered && this.ngbUtility.after(date, this.from)
    && this.ngbUtility.before(date, this.hovered);
  isInside = date => this.ngbUtility.after(date, this.from) && this.ngbUtility.before(date, this.to);
  isFrom = date => this.ngbUtility.equals(date, this.from);
  isTo = date => this.ngbUtility.equals(date, this.to);

  constructor(public ngbUtility: NgbUtility, public dataStore: DataStore, private calendar: NgbCalendar) {
  }

  ngOnInit(): void {
    this.driversSubscription = this.dataStore.getAllDrivers().subscribe(ds => this.drivers = ds);
    this.from = this.calendar.getToday();
    this.to = this.calendar.getNext(this.calendar.getToday(), 'd', 7);
    this.fetchTrips();
  }

  ngOnDestroy(): void {
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
    if (this.driversSubscription) this.driversSubscription.unsubscribe();
  }

  onDateChange(date: NgbDateStruct) {
    if (!this.from && !this.to) {
      this.from = date;
    } else if (this.from && !this.to && this.ngbUtility.after(date, this.from)) {
      this.to = date;
      this.fetchTrips();
    } else {
      this.to = null;
      this.from = date;
    }
  }

  fetchTrips(): void {
    this.range = this.ngbUtility.range(this.from, this.to);
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
    this.tripsSubscription = this.dataStore.getTrips(this.from, this.to).subscribe(ts => {
      this.trips = this.filteredTrips = ts;
      this.filterTripsByDriver();
    });
  }

  filterByDate(trips: Trip[], date: NgbDate): Trip[] {
    if (!trips || !trips.length) return [];

    const start = this.ngbUtility.toJSDate(date);
    const end = this.ngbUtility.toJSDate(this.calendar.getNext(NgbDate.from(date), 'd'));
    return trips.filter(t => t.start >= start && t.start < end);
  }

  private filterTripsByDriver() {
    if (!this._selectedDriver) return;
    this.filteredTrips = this.trips.filter(t => Utility.isAssigned(this._selectedDriver, t));
  }

  set selectedDriver(driver: Driver) {
    if (!this.trips) {
      return;
    }

    if (this._selectedDriver && driver.$key === this._selectedDriver.$key) {
      this._selectedDriver = null;
      this.filteredTrips = this.trips;
    } else {
      this._selectedDriver = driver;
      this.filterTripsByDriver()
    }
  }

  get selectedDriver(): Driver {
    return this._selectedDriver;
  }


}
