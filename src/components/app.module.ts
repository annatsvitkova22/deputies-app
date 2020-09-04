import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './main/app-routing.module';
import { AppComponent } from './main/app.component';
import { environment } from '../environments/environment';
import { AuthComponent } from './auth/auth.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { AuthService } from './auth/auth.service';
import { authReducer } from '../store/auth.reducer';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SingUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({authStore: authReducer}),
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
