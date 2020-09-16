import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from '.././auth/auth.component';
import { AuthGuard } from './auth.guard';
import { SingUpComponent } from '../sing-up/sing-up.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AppealComponent } from '../appeal/create-appeal/appeal.component';
import { SettingsComponent } from '../settings/settings.component';
import { DeputyComponent } from '../deputy/deputy.component';
import { MainComponent } from '../../pages/main/main.component';

const routes: Routes = [
  { path: 'sign-up', component: SingUpComponent },
  { path: 'sign-in', component: AuthComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'create-appeal', component: AppealComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'deputy/:id', component: DeputyComponent },
  { path: '', pathMatch: 'full', component: MainComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
