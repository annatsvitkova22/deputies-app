import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './main/app-routing.module';
import { AppComponent } from './main/app.component';
import { environment } from '../environments/environment';
import { AuthComponent } from './auth/auth.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { AuthService } from './auth/auth.service';
import { authReducer } from '../store/auth.reducer';
import { GenericInputComponent } from './generic-input/generic-input.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './main/auth.guard';
import { AppealComponent } from './appeal/appeal.component';
import { AppealService } from './appeal/appeal.service';
import { NgbdModalContent } from './modal/modal.component';
import { SettingsService } from './settings/settings.service';
import { SettingsComponent } from './settings/settings.component';
import { ChangeEmailComponent } from './settings/change-email/change-email.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ChangeInfoComponent } from './settings/change-info/change-info.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SingUpComponent,
    GenericInputComponent,
    ResetPasswordComponent,
    AppealComponent,
    NgbdModalContent,
    SettingsComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    ChangeInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    StoreModule.forRoot({authStore: authReducer}),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    AuthService,
    AuthGuard,
    AppealService,
    SettingsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent]
})
export class AppModule { }
