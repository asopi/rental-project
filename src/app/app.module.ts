import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxJdenticonModule } from 'ngx-jdenticon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { LendingComponent } from './components/lending/lending.component';
import { RentingComponent } from './components/renting/renting.component';
import { ShowroomComponent } from './components/showroom/showroom.component';
import { FormatAddressPipe } from './pipes/format-address.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShowroomComponent,
    LendingComponent,
    RentingComponent,
    CardComponent,
    FormatAddressPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    ClipboardModule,
    MatTooltipModule,
    NgxJdenticonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
