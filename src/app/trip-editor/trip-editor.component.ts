import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {DataStore} from '../data.service';
import {Utility} from '../utility';
import {Trip} from 'app/trip';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-trip-editor',
  templateUrl: './trip-editor.component.html',
  styleUrls: ['./trip-editor.component.css']
})
export class TripEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() trip: Trip;
  availableDrivers: IMultiSelectOption[];
  availableVehicles: IMultiSelectOption[];
  tripForm: FormGroup;
  private driversSubscription: Subscription;
  private vehiclesSubscription: Subscription;

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
    this.driversSubscription = this.dataStore.getAllDrivers()
      .map(Utility.filterDeleted)
      .subscribe(ds => this.availableDrivers = ds.map(d => ({id: d.$key, name: d.displayName})));
    this.vehiclesSubscription = this.dataStore.getAllVehicles()
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

  ngOnDestroy(): void {
    if (this.driversSubscription) this.driversSubscription.unsubscribe();
    if (this.vehiclesSubscription) this.vehiclesSubscription.unsubscribe();
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
