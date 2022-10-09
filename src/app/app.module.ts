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
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxJdenticonModule } from 'ngx-jdenticon';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { LendingComponent } from './components/lending/lending.component';
import { RentingComponent } from './components/renting/renting.component';
import { ShowroomComponent } from './components/showroom/showroom.component';
import { FormatAddressPipe } from './pipes/format-address.pipe';
import { LendingDialogComponent } from './components/lending-dialog/lending-dialog.component';
import { RentingDialogComponent } from './components/renting-dialog/renting-dialog.component';
import { IdenticonComponent } from './components/identicon/identicon.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ShowroomComponent,
    LendingComponent,
    RentingComponent,
    CardComponent,
    FormatAddressPipe,
    LendingDialogComponent,
    RentingDialogComponent,
    IdenticonComponent
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
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    NgxJdenticonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
