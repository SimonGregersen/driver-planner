import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {DataStore} from '../data.service';
import {Utility} from '../utility';
import {Trip} from 'app/trip';
import {Subscription} from 'rxjs/Subscription';
import {NgbUtility} from '../ngb-date-utility';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-trip-editor',
  templateUrl: './trip-editor.component.html',
  styleUrls: ['./trip-editor.component.css']
})
export class TripEditorComponent implements OnInit, OnDestroy {
  save: (trip: Trip, updates: any) => void;
  trip: Trip;
  availableDrivers: IMultiSelectOption[];
  availableVehicles: IMultiSelectOption[];
  tripForm: FormGroup;
  private driversSubscription: Subscription;
  private vehiclesSubscription: Subscription;

  constructor(private dataStore: DataStore, private fb: FormBuilder, private ngbUtility: NgbUtility, public modal: NgbActiveModal) {
    this.tripForm = this.fb.group({
      name: ['', Validators.required],
      fromDate: [null, Validators.required],
      fromTime: null,
      toDate: null,
      toTime: null,
      drivers: [[]],
      vehicles: [[]],
      description: ''
    });
  }

  ngOnInit() {
    this.driversSubscription = this.dataStore.getAllDrivers()
      .map(Utility.filterDeleted)
      .subscribe(ds => this.availableDrivers = ds.map(d => ({id: d.$key, name: d.displayName})));
    this.vehiclesSubscription = this.dataStore.getAllVehicles()
      .map(Utility.filterDeleted)
      .subscribe(vs => this.availableVehicles = vs.map(v => ({id: v.$key, name: v.displayName})));
  }

  update() {
    const start = moment(this.trip.start);
    const end = (this.trip.end) ? moment(this.trip.end) : null;
    const fromDate = this.ngbUtility.getDate(start);
    const fromTime = this.ngbUtility.getTime(start);
    const toDate = (end) ? this.ngbUtility.getDate(end) : null;
    const toTime = (end) ? this.ngbUtility.getTime(end) : null;

    this.tripForm.patchValue({
      ...this.trip,
      fromDate: fromDate,
      fromTime: fromTime,
      toDate: toDate,
      toTime: toTime
    });
  }

  ngOnDestroy(): void {
    if (this.driversSubscription) this.driversSubscription.unsubscribe();
    if (this.vehiclesSubscription) this.vehiclesSubscription.unsubscribe();
  }

  onSubmit() {
    this.save(this.trip, this.formToTrip(this.tripForm.value));
  }

  formToTrip(form: any) {
    return {
      start: this.ngbUtility.toMoment(form.fromDate, form.fromTime),
      end: this.ngbUtility.toMoment(form.toDate, form.toTime),
      name: form.name || '',
      description: form.description || '',
      drivers: form.drivers || [],
      vehicles: form.vehicles || []
    }
  }

  public edit(trip: Trip, save: (trip: Trip, updates: any) => void) {
    this.save = save;
    this.trip = trip;

    this.update();
  }
}
