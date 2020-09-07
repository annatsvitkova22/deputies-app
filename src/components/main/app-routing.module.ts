import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from '.././auth/auth.component';
import { AuthGuard } from './auth.guard';
import { SingUpComponent } from '../sing-up/sing-up.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

const routes: Routes = [
  { path: 'page', component: AuthComponent, canActivate: [AuthGuard]},
  { path: 'signUp', component: SingUpComponent },
  { path: 'signIn', component: AuthComponent },
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: '', pathMatch: 'full', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
