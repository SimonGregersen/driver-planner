import {Component, Input, OnInit} from '@angular/core';
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
  @Input() date;
  availableDrivers: IMultiSelectOption[];
  tripForm: FormGroup;

  constructor(private dataStore: DataStore, private fb: FormBuilder) {
    this.tripForm = this.fb.group({
      name: ['', Validators.required],
      fromDate: [null, Validators.required],
      fromTime: null,
      toDate: null,
      toTime: null,
      drivers: [[]],
      description: ''
    });
  }

  ngOnInit() {
    this.dataStore.drivers
      .subscribe(ds => this.availableDrivers = ds.map(d => ({id: d.id, name: d.nickname})).toArray());

  }

  onSubmit(): void {
    // TODO: vehicles
    const val = this.tripForm.value;
    this.dataStore.addTrip(
      Utility.toJSDate(val.fromDate, val.fromTime), (val.toTime) ? Utility.toJSDate(val.toDate, val.toTime) : null
      , val.name, val.description, val.drivers, []);
    this.tripForm.reset();
  }
}
