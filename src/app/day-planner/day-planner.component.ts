import {Component, OnInit} from '@angular/core';
import {DataStore} from '../data.service';
import {Trip} from '../trip';
import {isUndefined} from 'util';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';

@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.css']
})
export class DayPlannerComponent implements OnInit {
  trips: Trip[];
  filteredTrips: Trip[];
  private _selectedDriverID: number;
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
      this.filteredTrips = this.trips.filter(t => !isUndefined(t.driverIDs.find(id => id === driverID)));
    }
  }

  get selectedDriverID(): number {
    return this._selectedDriverID;
  }

  set selectedDate(date: NgbDate) {
    this._selectedDate = date;
    this._selectedDriverID = null;
    this.dataStore.getTrips(date).subscribe(trips => this.trips = this.filteredTrips = trips.toArray());
  }

  get selectedDate(): NgbDate {
    return this._selectedDate;
  }

}
