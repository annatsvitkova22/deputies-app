import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'flat', component: AuthComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthComponent },
  { path: '', pathMatch: 'full', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
