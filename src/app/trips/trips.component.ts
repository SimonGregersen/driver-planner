import {Component, Input, OnInit} from '@angular/core';
import {List} from 'immutable';
import {Trip} from '../trip';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  @Input()
  trips: List<Trip>;

  constructor() {
  }

  ngOnInit() {
  }

}
