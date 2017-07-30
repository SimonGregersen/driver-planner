import {Component, OnInit} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {DataStore} from '../data.service';
import {Trip} from '../trip';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {Driver} from '../driver';
import {Utility} from '../utility';

@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.css']
})
export class DayPlannerComponent implements OnInit {
  utility = Utility;
  trips: Trip[];
  filteredTrips: Trip[];
  private _selectedDriver: Driver = null;
  private _selectedDate: NgbDate;

  constructor(public dataStore: DataStore, private calendar: NgbCalendar) {
  }

  ngOnInit(): void {
    this.selectedDate = this.calendar.getToday();
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

  set selectedDate(date: NgbDate) {
    this._selectedDate = date;
    this.dataStore.getTrips(date).subscribe(trips => {
      this.trips = this.filteredTrips = trips;
      this.filterTripsByDriver();
    });
  }

  get selectedDate(): NgbDate {
    return this._selectedDate;
  }

  private filterTripsByDriver(): void {
    if (!this._selectedDriver) {
      return;
    }
    this.filteredTrips = this.trips.filter(t => this.isAssigned(this._selectedDriver, t));
  }

  private isAssigned(driver: Driver, trip: Trip): boolean {
    const drivers = trip.drivers || [];
    return drivers.includes(driver.$key);
  }
}
