import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DataStore} from '../data.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {Utility} from '../utility';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {NgbUtility} from 'app/ngb-date-utility';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trip-creator',
  templateUrl: './trip-creator.component.html',
  styleUrls: ['./trip-creator.component.css']
})
export class TripCreatorComponent implements OnInit, OnDestroy {
  @Output() create = new EventEmitter<{ start, end, name, description, drivers, vehicles }>();
  @Input() showDate = true;
  availableDrivers: IMultiSelectOption[];
  availableVehicles: IMultiSelectOption[];
  tripForm: FormGroup;
  private driversSubscription: Subscription;
  private vehiclesSubscription: Subscription;

  constructor(private dataStore: DataStore, private fb: FormBuilder, private ngbUtility: NgbUtility, private calendar: NgbCalendar) {
  }

  ngOnInit() {
    this.tripForm = this.fb.group({
      name: ['', Validators.required],
      fromDate: (this.showDate) ? [null, Validators.required] : null,
      fromTime: null,
      toDate: null,
      toTime: null,
      drivers: [[]],
      vehicles: [[]],
      description: ''
    });

    this.driversSubscription = this.dataStore.getAllDrivers()
      .map(Utility.filterDeleted)
      .subscribe(ds => this.availableDrivers = ds.map(d => ({id: d.$key, name: d.displayName})));
    this.vehiclesSubscription = this.dataStore.getAllVehicles()
      .map(Utility.filterDeleted)
      .subscribe(vs => this.availableVehicles = vs.map(v => ({id: v.$key, name: v.displayName})));
  }


  ngOnDestroy(): void {
    if (this.driversSubscription) this.driversSubscription.unsubscribe();
    if (this.vehiclesSubscription) this.vehiclesSubscription.unsubscribe();
  }

  onSubmit(): void {
    const val = this.tripForm.value;
    const trip = {
      start: this.ngbUtility.toMoment(val.fromDate || this.calendar.getToday(), val.fromTime),
      end: (val.toDate || val.toTime) ? this.ngbUtility.toMoment(val.toDate || this.calendar.getToday(), val.toTime) : null,
      name: val.name,
      description: val.description,
      drivers: val.drivers,
      vehicles: val.vehicles
    };
    this.create.emit(trip);
    this.tripForm.reset();
  }
}
