import {Component, OnInit} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {DataStore} from '../data.service';
import {Utility} from '../utility';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  nickname: string;
  name: string;
  birthday: NgbDateStruct;

  constructor(public dataStore: DataStore) {
  }

  ngOnInit() {
  }

  create() {
    this.dataStore.addDriver(this.nickname, this.name, Utility.toJSDate(this.birthday));
  }
}
