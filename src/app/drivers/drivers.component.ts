import {Component, OnInit} from '@angular/core';
import {DataStore} from '../data.service';
import {Utility} from '../utility';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Driver} from '../driver';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  driverForm: FormGroup;
  drivers: Observable<Driver[]>;

  constructor(public dataStore: DataStore, private fb: FormBuilder) {
    this.driverForm = this.fb.group({
      displayName: ['', Validators.required],
      name: ['', Validators.required],
      birthday: null
    });
  }

  ngOnInit() {
    this.drivers = this.dataStore.getAllDrivers().map(Utility.filterDeleted);
  }

  create() {
    const val = this.driverForm.value;
    this.dataStore.addDriver(val.displayName, val.name, Utility.toJSDate(val.birthday));
    this.driverForm.reset();
  }

  removeDriver(driver: Driver) {
    this.dataStore.deleteDriver(driver);
  }
}
