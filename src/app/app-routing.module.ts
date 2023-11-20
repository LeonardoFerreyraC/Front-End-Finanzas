import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./main/pages/home/home.component";
import {SignInComponent} from "./main/pages/sign-in/sign-in.component";
import {SignUpComponent} from "./main/pages/sign-up/sign-up.component";
import {SimulatorComponent} from "./main/pages/simulator/simulator.component";
import {HistoryComponent} from "./main/pages/history/history.component";
import {PaymentPlanComponent} from "./main/pages/payment-plan/payment-plan.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent, children: [
      {path: 'simulator', component: SimulatorComponent},
      {path: 'history', component: HistoryComponent},
      {path: '', redirectTo: 'simulator', pathMatch: 'full'}
    ]},
  {path: 'signIn', component: SignInComponent},
  {path: 'signUp', component: SignUpComponent},
  {path: 'plan', component: PaymentPlanComponent},
  {path: '', redirectTo: 'signIn', pathMatch: 'full'},
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
