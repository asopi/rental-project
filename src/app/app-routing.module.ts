import { IsConnectedGuard } from './guards/is-connected.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RentingComponent } from './components/renting/renting.component';
import { ShowroomComponent } from './components/showroom/showroom.component';
import { LendingComponent } from './components/lending/lending.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [IsConnectedGuard],
  },
  {
    path: 'showroom',
    component: ShowroomComponent,
    canActivate: [IsConnectedGuard],
  },
  {
    path: 'lending',
    component: LendingComponent,
    canActivate: [IsConnectedGuard],
  },
  {
    path: 'renting',
    component: RentingComponent,
    canActivate: [IsConnectedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
