import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {DataStore} from '../data.service';
import {Utility} from '../utility';
import {Trip} from 'app/trip';
import {Subscription} from 'rxjs/Subscription';
import {NgbUtility} from '../ngb-date-utility';
import {NgbActiveModal, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-trip-editor',
  templateUrl: './trip-editor.component.html',
  styleUrls: ['./trip-editor.component.css']
})
export class TripEditorComponent implements OnInit, OnDestroy {
  @Input() showDate = true;
  save: (trip: Trip, updates: any) => void;
  trip: Trip;
  availableDrivers: IMultiSelectOption[];
  availableVehicles: IMultiSelectOption[];
  tripForm: FormGroup;
  private driversSubscription: Subscription;
  private vehiclesSubscription: Subscription;

  constructor(private dataStore: DataStore, private fb: FormBuilder, private ngbUtility: NgbUtility
    , private calendar: NgbCalendar, public modal: NgbActiveModal) {
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
    const val = this.tripForm.value;
    const start = this.ngbUtility.toMoment(val.fromDate || {year: 1970, month: 1, day: 1}, val.fromTime);
    const end = (val.toDate || val.toTime) ? this.ngbUtility.toMoment(val.toDate || this.ngbUtility.getDate(start), val.toTime) : null;

    this.save(this.trip, {
      start: start,
      end: (Utility.sameDate(start, end) && !val.toTime) ? null : end,
      name: val.name || '',
      description: val.description || '',
      drivers: val.drivers || [],
      vehicles: val.vehicles || []
    });
  }

  public edit(trip: Trip, save: (trip: Trip, updates: any) => void) {
    this.save = save;
    this.trip = trip;

    this.update();
  }
}
