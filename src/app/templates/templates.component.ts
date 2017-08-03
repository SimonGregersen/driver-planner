import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataStore} from '../data.service';
import {Template} from '../template';
import {Subscription} from 'rxjs/Subscription';
import {Trip} from '../trip';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TripEditorComponent} from '../trip-editor/trip-editor.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {
  templateForm: FormGroup;
  templates: Template[];
  trips: Trip[];
  private _selectedTemplate: Template;
  private templateSubscription: Subscription;
  private tripsSubscription: Subscription;

  constructor(private fb: FormBuilder, private dataStore: DataStore, private modalService: NgbModal) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.templateSubscription = this.dataStore.getAllTemplates().subscribe(ts => {
      this.templates = ts || [];
      if (this.templates.length) this.selectedTemplate = this.templates[0];
    });
  }

  ngOnDestroy(): void {
    if (this.templateSubscription) this.templateSubscription.unsubscribe();
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
  }

  createTemplate() {
    if (!this.templateForm.valid) return;
    const val = this.templateForm.value;
    this.dataStore.addTemplate(val.name);
    this.templateForm.reset();
  }

  removeTemplate(template: Template) {
    this.dataStore.removeTemplate(template);
  }

  addTrip(trip: Trip): void {
    if (!this.selectedTemplate) return;
    this.dataStore.addTripToTemplate(this.selectedTemplate, trip);
  }

  removeTrip(trip: Trip) {
    this.dataStore.removeTripFromTemplate(this.selectedTemplate, trip);
  }

  edit(trip: Trip) {
    const modalRef = this.modalService.open(TripEditorComponent, {size: 'lg'});
    modalRef.componentInstance.edit(trip, (t, u) => this.dataStore.updateTripFromTemplate(this.selectedTemplate, t, u));
  }


  set selectedTemplate(template: Template) {
    this._selectedTemplate = template;
    if (this.tripsSubscription) this.tripsSubscription.unsubscribe();
    this.tripsSubscription = this.dataStore.getTemplateTrips(template).subscribe(ts => this.trips = ts);
  }

  get selectedTemplate(): Template {
    return this._selectedTemplate;
  }

}
