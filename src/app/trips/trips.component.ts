import {Component, Input, OnInit} from '@angular/core';
import {Trip} from '../trip';
import {DataStore} from '../data.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  @Input() trips: Trip[];
  beingEdited: Trip;

  constructor(public dataStore: DataStore, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  removeTrip(trip: Trip) {
    this.dataStore.removeTrip(trip);
  }

  editTrip(content, trip: Trip) {
    this.beingEdited = trip;
    this.modalService.open(content, {size: 'lg'});
  }

}
