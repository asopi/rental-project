import { RentingComponent } from './components/renting/renting.component';
import { ShowroomComponent } from './components/showroom/showroom.component';
import { LendingComponent } from './components/lending/lending.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 'path': '', redirectTo: 'showroom', pathMatch: 'full' },
  { 'path': 'showroom', component: ShowroomComponent },
  { 'path': 'lending', component: LendingComponent },
  { 'path': 'renting', component: RentingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
