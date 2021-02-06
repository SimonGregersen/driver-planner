import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DataStore} from '../data.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {Utility} from '../utility';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {NgbUtility} from 'app/ngb-date-utility';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trip-creator',
  templateUrl: './trip-creator.component.html',
  styleUrls: ['./trip-creator.component.css']
})
export class TripCreatorComponent implements OnInit, OnDestroy {
  @Output() create = new EventEmitter<{ start, end, name, description, drivers, vehicles }>();
  @Input() defaultDate: NgbDateStruct = null;
  @Input() showDate = true;
  availableDrivers: IMultiSelectOption[];
  availableVehicles: IMultiSelectOption[];
  tripForm: FormGroup;
  private driversSubscription: Subscription;
  private vehiclesSubscription: Subscription;

  constructor(private dataStore: DataStore, private fb: FormBuilder, private ngbUtility: NgbUtility, public modal: NgbActiveModal) {
  }

  ngOnInit() {
    this.tripForm = this.fb.group({
      name: ['', Validators.required],
      fromDate: (this.showDate) ? [this.defaultDate, Validators.required] : null,
      fromTime: null,
      toDate: this.defaultDate,
      toTime: null,
      drivers: [[]],
      vehicles: [[]],
      description: ''
    });

    this.driversSubscription = this.dataStore.getAllDrivers()
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
    const start = this.ngbUtility.toMoment(val.fromDate || {year: 1970, month: 1, day: 1}, val.fromTime);
    const end = (val.toDate || val.toTime) ? this.ngbUtility.toMoment(val.toDate || this.ngbUtility.getDate(start), val.toTime) : null;

    const trip = {
      start: start,
      end: (Utility.sameDate(start, end) && !val.toTime) ? null : end,
      name: val.name,
      description: val.description,
      drivers: val.drivers,
      vehicles: val.vehicles
    };
    this.create.emit(trip);
    this.tripForm.reset();
  }
}
