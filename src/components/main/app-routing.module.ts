import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from '.././auth/auth.component';
import { AuthGuard } from './auth.guard';
import { SingUpComponent } from '../sing-up/sing-up.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { AppealComponent } from '../appeal/create-appeal/appeal.component';
import { DeputyComponent } from '../deputy/deputy.component';
import { MainComponent } from '../../pages/main/main.component';
import { DeputiesComponent } from '../../pages/deputies/deputies.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { EditComponent } from '../../pages/edit/edit.component';
import { AuthSimpleGuard } from './auth-simple.guard';
import { ConfirmAppealComponent } from '../../pages/confirm-appeal/confirm-appeal.component';
import { FeedbackComponent } from '../../pages/feedback/feedback.component';

const routes: Routes = [
  { path: 'sign-up', component: SingUpComponent },
  { path: 'sign-in', component: AuthComponent },
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'create-appeal', component: AppealComponent, canActivate: [AuthGuard] },
  { path: 'deputies', component: DeputiesComponent, canActivate: [AuthSimpleGuard] },
  { path: 'deputy/:id', component: DeputyComponent, canActivate: [AuthSimpleGuard] },
  { path: 'confirm-appeal/:id', component: ConfirmAppealComponent, canActivate: [AuthGuard] },
  { path: 'feedback/:id', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', component: MainComponent, canActivate: [AuthSimpleGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
