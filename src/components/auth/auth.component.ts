import { Component } from '@angular/core';

import { AuthService } from './auth.service';
import { ResultModel } from '../../models';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  constructor(
      private authService: AuthService
  ){}

  onSubmit = async ({email, password}) => {
    const result: ResultModel = await this.authService.signIn(email, password);
    if (result.status) {
      window.alert(result.message);
    }
  }

  onGoogleLogin = async () => {
    await this.authService.googleSingIn();
  }

  onFacebookLogin = async () => {
    await this.authService.facebookSingIn();
  }
}
