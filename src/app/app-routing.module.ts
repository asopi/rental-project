import { RentingComponent } from './components/renting/renting.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { LendingComponent } from './components/lending/lending.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 'path': '', redirectTo: 'marketplace', pathMatch: 'full' },
  { 'path': 'marketplace', component: MarketplaceComponent },
  { 'path': 'lending', component: LendingComponent },
  { 'path': 'renting', component: RentingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
