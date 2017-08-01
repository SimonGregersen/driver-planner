import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DataStore} from './data.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TripsComponent} from './trips/trips.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {SignInComponent} from './sign-in/sign-in.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {DayPlansComponent} from './day-planner/day-plans.component';
import {HttpModule} from '@angular/http';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AuthenticationService} from './authentication.service';
import {OverviewComponent} from './overview/overview.component';
import {TemplatesComponent} from './templates/templates.component';
import {RoutesComponent} from './routes/routes.component';
import {DriversComponent} from './drivers/drivers.component';
import {VehiclesComponent} from './vehicles/vehicles.component';
import {TripCreatorComponent} from './trip-creator/trip-creator.component';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {DriverPlansComponent} from './driver-planner/driver-plans.component';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';

@NgModule({
  declarations: [
    AppComponent,
    TripsComponent,
    SignInComponent,
    DayPlansComponent,
    OverviewComponent,
    TemplatesComponent,
    RoutesComponent,
    DriversComponent,
    VehiclesComponent,
    TripCreatorComponent,
    DriverPlansComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule.forRoot(),
    MultiselectDropdownModule,
    ConfirmationPopoverModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    DataStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
