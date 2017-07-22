import {Component, Input, OnInit} from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {isNull} from 'util';
import {DataStore} from '../data.service';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {Utility} from '../utility';

@Component({
  selector: 'app-trip-creator',
  templateUrl: './trip-creator.component.html',
  styleUrls: ['./trip-creator.component.css']
})
export class TripCreatorComponent implements OnInit {
  private _fromDate: NgbDateStruct;
  private _fromTime: NgbTimeStruct;
  private _toDate: NgbDateStruct;
  private _toTime: NgbTimeStruct;
  drivers: number[] = [];
  name: string;
  description: string;

  availableDrivers: IMultiSelectOption[];
  selectSettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 5
  };
  selectTexts: IMultiSelectTexts = {
    checkAll: 'Vælg all',
    uncheckAll: 'Fjern alle',
    checked: 'chauffør valgt',
    checkedPlural: 'chauffører valgt',
    searchPlaceholder: 'Søg',
    defaultTitle: 'Vælg chauffører',
    allSelected: 'Alle chauffører valgt'
  };

  ngOnInit() {
    this.dataStore.drivers
      .subscribe(ds => this.availableDrivers = ds.map(d => ({id: d.id, name: d.firstName})).toArray());
  }

  constructor(private dataStore: DataStore) {
  }

  create(): void {
    if (this.name === '' || !this._fromDate || this._fromDate === null) {
      return;
    }
    this.dataStore.addTrip(
      Utility.toJSDate(this._fromDate, this._fromTime), Utility.toJSDate(this._toDate, this._toTime)
      , this.name, this.description, this.drivers);
    this.reset();
  }

  reset(): void {
    this.name = this.description = '';
    this._toDate = null;
    this._toTime = null;
    this.drivers = [];
  }

  set fromDate(date: NgbDateStruct) {
    this._fromDate = date;
    if (!this._toDate || NgbDate.from(this._fromDate).after(NgbDate.from(this._toDate))) {
      this._toDate = this._fromDate;
    }
  }

  get fromDate(): NgbDateStruct {
    return this._fromDate
  }

  set toDate(date: NgbDateStruct) {
    this._toDate = date;
    if (NgbDate.from(this._fromDate).after(NgbDate.from(this._toDate))) {
      this._fromDate = this._toDate;
    }
  }

  get toDate(): NgbDateStruct {
    return this._toDate;
  }

  set fromTime(time: NgbTimeStruct) {
    this._fromTime = time;
    if (this._toDate === this._fromDate && this._toTime && !this.before(this._fromTime, this._toTime)) {
      this._toTime = this._fromTime;
    }
  }

  get fromTime(): NgbTimeStruct {
    return this._fromTime;
  }

  set toTime(time: NgbTimeStruct) {
    if (isNull(time)) {
      return;
    }
    this._toTime = time;
    if (this._toDate === this._fromDate && !this.before(this._fromTime, this._toTime)) {
      this._fromTime = this._toTime;
    }
  }

  get toTime(): NgbTimeStruct {
    return this._toTime;
  }

  before(min: NgbTimeStruct, max: NgbTimeStruct): boolean {
    return min.hour < max.hour && min.minute < max.minute;
  }
}
