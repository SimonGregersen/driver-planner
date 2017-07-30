import {Component, OnInit} from '@angular/core';
import {DataStore} from '../data.service';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {Utility} from '../utility';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-trip-creator',
  templateUrl: './trip-creator.component.html',
  styleUrls: ['./trip-creator.component.css']
})
export class TripCreatorComponent implements OnInit {
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
    this.dataStore.drivers
      .subscribe(ds => this.availableDrivers = ds.map(d => ({id: d.$key, name: d.displayName})));
    this.dataStore.vehicles
      .subscribe(vs => this.availableVehicles = vs.map(v => ({id: v.$key, name: v.displayName})));
  }

  onSubmit(): void {
    const val = this.tripForm.value;
    const from = Utility.toJSDate(val.fromDate, val.fromTime);
    const to = (val.toTime) ? Utility.toJSDate(val.toDate, val.toTime) : null;
    this.dataStore.addTrip(from, to, val.name, val.description, val.drivers, val.vehicles);
    this.tripForm.reset();
  }
}
