import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStore} from '../data.service';
import {Trip} from '../trip';
import {NgbCalendar, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Driver} from '../driver';
import {Subscription} from 'rxjs/Subscription';
import {NgbUtility} from '../ngb-date-utility';
import {Utility} from '../utility';

@Component({
  selector: 'app-day-plans',
  templateUrl: './day-plans.component.html',
  styleUrls: ['./day-plans.component.css']
})
export class DayPlansComponent implements OnInit, OnDestroy {
  filteredTrips: Trip[];
  drivers: Driver[];
  trips: Trip[];
  private tripsSubscription: Subscription;
  private driversSubscription: Subscription;
  private _selectedDriver: Driver = null;
  private _selectedDate: NgbDateStruct;

  constructor(public dataStore: DataStore, public ngbUtility: NgbUtility, private calendar: NgbCalendar) {
  }

  ngOnInit(): void {
    this.selectedDate = this.calendar.getToday();
    this.driversSubscription = this.dataStore.getAllDrivers().subscribe(ds => this.drivers = ds);
  }

  ngOnDestroy(): void {
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
    if (this.driversSubscription) this.driversSubscription.unsubscribe();
  }

  set selectedDriver(driver: Driver) {
    if (!this.trips) return;

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

  set selectedDate(date: NgbDateStruct) {
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
    this._selectedDate = date;
    this.tripsSubscription = this.dataStore.getTrips(date).subscribe(trips => {
      this.trips = this.filteredTrips = trips;
      this.filterTripsByDriver();
    });
  }

  get selectedDate(): NgbDateStruct {
    return this._selectedDate;
  }

  private filterTripsByDriver(): void {
    if (!this._selectedDriver) return;
    this.filteredTrips = this.trips.filter(t => Utility.isAssigned(this._selectedDriver, t));
  }


}
