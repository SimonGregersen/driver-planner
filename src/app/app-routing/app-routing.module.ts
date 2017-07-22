import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from '../sign-in/sign-in.component';
import {DayPlannerComponent} from '../day-planner/day-planner.component';
import {OverviewComponent} from '../overview/overview.component';
import {TemplatesComponent} from '../templates/templates.component';
import {RoutesComponent} from '../routes/routes.component';
import {DriversComponent} from '../drivers/drivers.component';
import {VehiclesComponent} from '../vehicles/vehicles.component';

const routes: Routes = [
  {path: '', redirectTo: '/day', pathMatch: 'full'},
  {path: 'login', component: SignInComponent},
  {path: 'overview', component: OverviewComponent},
  {path: 'day', component: DayPlannerComponent},
  {path: 'templates', component: TemplatesComponent},
  {path: 'routes', component: RoutesComponent},
  {path: 'drivers', component: DriversComponent},
  {path: 'vehicles', component: VehiclesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
