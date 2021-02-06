import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStore} from '../data.service';
import {Trip} from '../trip';
import {NgbCalendar, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Driver} from '../driver';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {NgbUtility} from '../ngb-date-utility';
import {Utility} from '../utility';
import {TripEditorComponent} from '../trip-editor/trip-editor.component';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {TripCreatorComponent} from '../trip-creator/trip-creator.component';

@Component({
  selector: 'app-day-plans',
  templateUrl: './day-plans.component.html',
  styleUrls: ['./day-plans.component.css']
})
export class DayPlansComponent implements OnInit, OnDestroy {
  filteredTrips: Trip[];
  drivers: Observable<Driver[]>;
  trips: Trip[];
  selectedTemplate: string;
  availableTemplates: IMultiSelectOption[];
  private tripsSubscription: Subscription;
  private templatesSubscription: Subscription;
  private _selectedDriver: Driver = null;
  private _selectedDate: NgbDateStruct;

  constructor(public dataStore: DataStore, public ngbUtility: NgbUtility, private calendar: NgbCalendar, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.selectedDate = this.calendar.getToday();
    this.drivers = this.dataStore.getAllDrivers()
    this.templatesSubscription = this.dataStore.getAllTemplates()
      .subscribe(ts => this.availableTemplates = ts.map(t => ({id: t.$key, name: t.name})));
  }

  ngOnDestroy(): void {
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
  }

  removeTrip(trip: Trip) {
    this.dataStore.removeTrip(trip);
  }

  edit(trip: Trip) {
    const modalRef = this.modalService.open(TripEditorComponent, {size: 'lg'});
    modalRef.componentInstance.edit(trip, (t, u) => this.dataStore.updateTrip(t, u));
  }

  create() {
    const modalRef = this.modalService.open(TripCreatorComponent, {size: 'lg'});
    modalRef.componentInstance.defaultDate = this.selectedDate;
    modalRef.componentInstance.create.subscribe(t => this.dataStore.addTrip(t));
  }

  insertTemplate() {
    this.dataStore.insertTemplate(this.ngbUtility.toMoment(this.selectedDate), this.selectedTemplate);
  }

  set selectedDriver(driver: Driver) {
    if (!this.trips) return;

    if (this._selectedDriver && driver.$key === this._selectedDriver.$key) {
      this._selectedDriver = null;
      this.filteredTrips = this.trips;
    } else {
      this._selectedDriver = driver;
      this.filterTripsByDriver()
    }
  }

  get selectedDriver(): Driver {
    return this._selectedDriver;
  }

  set selectedDate(date: NgbDateStruct) {
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
    this._selectedDate = date;
    this.tripsSubscription = this.dataStore.getTrips(date).subscribe(trips => {
      this.trips = this.filteredTrips = trips;
      this.filterTripsByDriver();
    });
  }

  get selectedDate(): NgbDateStruct {
    return this._selectedDate;
  }

  private filterTripsByDriver(): void {
    if (!this._selectedDriver) return;
    this.filteredTrips = this.trips.filter(t => Utility.isAssigned(this._selectedDriver, t));
  }


}
