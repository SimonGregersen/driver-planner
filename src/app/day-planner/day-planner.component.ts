import {Component, OnInit} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {isUndefined} from 'util';
import {DataStore} from '../data.service';
import {Trip} from '../trip';

@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.css']
})
export class DayPlannerComponent implements OnInit {
  trips: Trip[];
  filteredTrips: Trip[];
  private _selectedDriverID: number = null;
  private _selectedDate: NgbDate;

  constructor(public dataStore: DataStore) {
  }

  ngOnInit(): void {
    const now = new Date();
    this.selectedDate = new NgbDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  set selectedDriverID(driverID: number) {
    if (!this.trips) {
      return;
    }

    if (driverID === this._selectedDriverID) {
      this._selectedDriverID = null;
      this.filteredTrips = this.trips;
    } else {
      this._selectedDriverID = driverID;
      this.filterTripsByDriver()
    }
  }

  get selectedDriverID(): number {
    return this._selectedDriverID;
  }

  set selectedDate(date: NgbDate) {
    this._selectedDate = date;
    this.dataStore.getTrips(date).subscribe(trips => {
      this.trips = this.filteredTrips = trips.toArray();
      this.filterTripsByDriver();
    });
  }

  get selectedDate(): NgbDate {
    return this._selectedDate;
  }

  private filterTripsByDriver(): void {
    if (this._selectedDriverID === null) {
      return;
    }
    this.filteredTrips = this.trips.filter(t => !isUndefined(t.driverIDs.find(id => id === this._selectedDriverID)));
  }

}
