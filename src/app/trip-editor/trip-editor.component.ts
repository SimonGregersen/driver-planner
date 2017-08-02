import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {DataStore} from '../data.service';
import {Utility} from '../utility';
import {Trip} from 'app/trip';

@Component({
  selector: 'app-trip-editor',
  templateUrl: './trip-editor.component.html',
  styleUrls: ['./trip-editor.component.css']
})
export class TripEditorComponent implements OnInit, OnChanges {
  @Input() trip: Trip;
  availableDrivers: IMultiSelectOption[];
  availableVehicles: IMultiSelectOption[];
  tripForm: FormGroup;

  constructor(private dataStore: DataStore, private fb: FormBuilder) {
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
    this.dataStore.getAllDrivers()
      .map(Utility.filterDeleted)
      .subscribe(ds => this.availableDrivers = ds.map(d => ({id: d.$key, name: d.displayName})));
    this.dataStore.getAllVehicles()
      .map(Utility.filterDeleted)
      .subscribe(vs => this.availableVehicles = vs.map(v => ({id: v.$key, name: v.displayName})));
  }

  ngOnChanges(changes: SimpleChanges) {
    const start = new Date(this.trip.start);
    const end = (this.trip.end) ? new Date(this.trip.end) : null;
    const fromDate = Utility.toNgbDate(start);
    const fromTime = Utility.toNgbTime(start);
    const toDate = (end) ? Utility.toNgbDate(end) : null;
    const toTime = (end) ? Utility.toNgbTime(end) : null;

    this.tripForm.patchValue({
      ...this.trip,
      fromDate: fromDate,
      fromTime: fromTime,
      toDate: toDate,
      toTime: toTime
    });
  }

  onSubmit() {
    const val: Trip = this.formToTrip(this.tripForm.value);
    this.dataStore.updateTrip(this.trip, val);
  }

  formToTrip(form: any): Trip {
    return <Trip>{
      start: Utility.toJSDate(form.fromDate, form.fromTime),
      end: Utility.toJSDate(form.toDate, form.toTime),
      name: form.name || '',
      description: form.description || '',
      drivers: form.drivers || [],
      vehicles: form.vehicles || []
    }
  }

}
