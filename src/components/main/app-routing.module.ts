import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from '.././auth/auth.component';
import { AuthGuard } from './auth.guard';
import { SingUpComponent } from '../sing-up/sing-up.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AppealComponent } from '../appeal/appeal.component';

const routes: Routes = [
  { path: 'signUp', component: SingUpComponent },
  { path: 'signIn', component: AuthComponent },
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'createDeputy', component: AppealComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', component: ResetPasswordComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
