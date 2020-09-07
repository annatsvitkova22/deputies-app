import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isError: boolean;
  message: string;

  constructor(
      private authService: AuthService
  ){}

  ngOnInit() {}

  onSubmit = async ({email, password}) => {
    this.isError = await this.authService.signIn(email, password);
    this.message = 'Wrong login or password';
  }

  onGoogleLogin = async () => {
    await this.authService.googleSingIn();
  }
}
