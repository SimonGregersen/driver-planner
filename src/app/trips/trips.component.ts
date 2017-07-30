import {Component, Input, OnInit} from '@angular/core';
import {Trip} from '../trip';
import {DataStore} from '../data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  @Input()
  trips: Trip[];

  constructor(public dataStore: DataStore) {
  }

  ngOnInit() {
  }

}
