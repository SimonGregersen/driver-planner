import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DataStore} from '../data.service';
import {Trip} from '../trip';
import {List} from 'immutable';

@Component({
  selector: 'app-day-planner',
  templateUrl: './day-planner.component.html',
  styleUrls: ['./day-planner.component.css']
})
export class DayPlannerComponent implements OnInit {
  trips: Observable<List<Trip>>;
  date: string;

  constructor(public dataStore: DataStore) {
  }

  ngOnInit(): void {
    this.trips = this.dataStore.trips;
  }


}
