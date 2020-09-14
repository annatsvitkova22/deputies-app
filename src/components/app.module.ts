import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule, AppComponent, AuthComponent, SingUpComponent, AuthService,
  GenericInputComponent, ResetPasswordComponent, AuthGuard, AppealComponent, ChangeEmailComponent,
  AppealService, NgbdModalContent, SettingsService, SettingsComponent, ChangePasswordComponent, ChangeInfoComponent,
  LoaderComponent, DeputyComponent, DeputyService, AppealCardComponent, AvatarComponent } from './index';
import { environment } from '../environments/environment';
import { authReducer } from '../store/auth.reducer';

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
    ChangeInfoComponent,
    LoaderComponent,
    DeputyComponent,
    AppealCardComponent,
    AvatarComponent
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
    SettingsService,
    DeputyService
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent]
})
export class AppModule { }
