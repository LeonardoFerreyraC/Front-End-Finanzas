import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './main/pages/home/home.component';
import {RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { SignInComponent } from './main/pages/sign-in/sign-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from "@angular/material/grid-list";
import {NgOptimizedImage} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import { SignUpComponent } from './main/pages/sign-up/sign-up.component';
import {CarDialogComponent, SimulatorComponent} from './main/pages/simulator/simulator.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {HistoryComponent} from './main/pages/history/history.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatRadioModule} from "@angular/material/radio";
import {MatChipsModule} from "@angular/material/chips";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {ActionDialogComponent, PaymentPlanComponent} from './main/pages/payment-plan/payment-plan.component';
import {MatTableModule} from "@angular/material/table";
import {AuthenticationService} from "./main/services/authentication.service";
import {HttpClientModule} from "@angular/common/http";
import {EntryService} from "./main/services/entry.service";
import {MatDialogModule} from "@angular/material/dialog";
import {ToastrModule} from "ngx-toastr";
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    SimulatorComponent,
    HistoryComponent,
    PaymentPlanComponent,
    CarDialogComponent,
    ActionDialogComponent
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    RouterOutlet,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatRadioModule,
    MatChipsModule,
    FormsModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    MatDialogModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthenticationService, EntryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
