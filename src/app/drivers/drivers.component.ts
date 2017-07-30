import {Component, OnInit} from '@angular/core';
import {DataStore} from '../data.service';
import {Utility} from '../utility';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  driverForm: FormGroup;

  constructor(public dataStore: DataStore, private fb: FormBuilder) {
    this.driverForm = this.fb.group({
      displayName: ['', Validators.required],
      name: ['', Validators.required],
      birthday: null
    });
  }

  ngOnInit() {
  }

  create() {
    const val = this.driverForm.value;
    this.dataStore.addDriver(val.displayName, val.name, (val.birthday) ? Utility.toJSDate(val.birthday) : null);
  }
}
