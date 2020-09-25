import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule, AppComponent, AuthComponent, SingUpComponent, AuthService,
  GenericInputComponent, ResetPasswordComponent, AuthGuard, AppealComponent, ChangeEmailComponent,
  AppealService, NgbdModalContent, SettingsService, ChangePasswordComponent, ChangeInfoComponent,
  LoaderComponent, DeputyComponent, DeputyService, AppealCardComponent, AvatarComponent, HeaderComponent, MultiSelectComponent,
  TabComponent, AccountCardComponent, SmallCardComponent, UploadedFileComponent, ModalComponent } from './index';
import { environment } from '../environments/environment';
import { authReducer } from '../store/auth.reducer';
import { MainComponent } from '../pages/main/main.component';
import { DeputyCardComponent } from './deputy-card/deputy-card.component';
import { MainService } from '../pages/main/main.service';
import { settingsReducer } from '../store/settings.reducer';
import { DeputiesComponent } from '../pages/deputies/deputies.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { EditComponent } from '../pages/edit/edit.component';
import { AuthSimpleGuard } from './main/auth-simple.guard';
import { ConfirmAppealComponent } from '../pages/confirm-appeal/confirm-appeal.component';
import { FeedbackComponent } from '../pages/feedback/feedback.component';
import { AboutProjectComponent } from '../pages/about-project/about-project.component';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SingUpComponent,
    GenericInputComponent,
    ResetPasswordComponent,
    AppealComponent,
    NgbdModalContent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    ChangeInfoComponent,
    LoaderComponent,
    DeputyComponent,
    AppealCardComponent,
    AvatarComponent,
    HeaderComponent,
    MainComponent,
    DeputyCardComponent,
    MultiSelectComponent,
    TabComponent,
    AccountCardComponent,
    SmallCardComponent,
    DeputiesComponent,
    ProfileComponent,
    EditComponent,
    UploadedFileComponent,
    ModalComponent,
    ConfirmAppealComponent,
    FeedbackComponent,
    AboutProjectComponent
  ],
  imports: [
    BrowserModule,
    NgSelectModule,
    AngularMultiSelectModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    StoreModule.forRoot({authStore: authReducer, settingsStore: settingsReducer}),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    AuthService,
    AuthGuard,
    AppealService,
    SettingsService,
    DeputyService,
    MainService,
    AuthSimpleGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent]
})
export class AppModule { }
