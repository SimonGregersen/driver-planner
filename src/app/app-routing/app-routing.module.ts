import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DayPlansComponent} from '../day-plans/day-plans.component';
import {OverviewComponent} from '../overview/overview.component';
import {TemplatesComponent} from '../templates/templates.component';
import {RoutesComponent} from '../routes/routes.component';
import {DriversComponent} from '../drivers/drivers.component';
import {VehiclesComponent} from '../vehicles/vehicles.component';
import {PeriodPlansComponent} from '../period-plans/period-plans.component';
import {AuthGuard} from '../auth-guard';
import {SignInComponent} from '../sign-in/sign-in.component';

const routes: Routes = [
  {
    path: 'login',
    component: SignInComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'day-plans'},
      {path: 'overview', component: OverviewComponent},
      {path: 'day-plans', component: DayPlansComponent},
      {path: 'period-plans', component: PeriodPlansComponent},
      {path: 'templates', component: TemplatesComponent},
      {path: 'routes', component: RoutesComponent},
      {path: 'drivers', component: DriversComponent},
      {path: 'vehicles', component: VehiclesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
