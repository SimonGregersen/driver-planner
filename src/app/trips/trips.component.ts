import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Trip} from '../trip';
import {DataStore} from '../data.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Driver} from '../driver';
import {Vehicle} from '../vehicle';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit, OnDestroy {
  @Input() trips: Trip[] = [];
  beingEdited: Trip;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  private driversSubscription: Subscription;
  private vehiclesSubscription: Subscription;

  constructor(public dataStore: DataStore, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.driversSubscription = this.dataStore.getAllDrivers().subscribe(ds => this.drivers = ds);
    this.vehiclesSubscription = this.dataStore.getAllVehicles().subscribe(vs => this.vehicles = vs);
  }

  ngOnDestroy(): void {
    if (this.driversSubscription) this.driversSubscription.unsubscribe();
    if (this.vehiclesSubscription) this.vehiclesSubscription.unsubscribe();
  }

  getDriver(key: string): Driver {
    return this.drivers.find(d => d.$key === key);
  }

  getVehicle(key: string): Vehicle {
    return this.vehicles.find(v => v.$key === key);
  }

  removeTrip(trip: Trip) {
    this.dataStore.removeTrip(trip);
  }

  editTrip(content, trip: Trip) {
    this.beingEdited = trip;
    this.modalService.open(content, {size: 'lg'});
  }

}
