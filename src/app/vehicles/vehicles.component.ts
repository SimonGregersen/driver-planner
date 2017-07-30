import {Component, OnInit} from '@angular/core';
import {DataStore} from '../data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utility} from '../utility';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  vehicleForm: FormGroup;

  constructor(public dataStore: DataStore, private fb: FormBuilder) {
    this.vehicleForm = this.fb.group({
      displayName: ['', Validators.required],
      brand: '',
      regNo: '',
      latestInspection: ''
    })
  }

  ngOnInit() {
  }

  create() {
    const val = this.vehicleForm.value;
    this.dataStore.addVehicle(val.displayName, val.brand, val.regNo, Utility.toJSDate(val.latestInspection));
  }

}
