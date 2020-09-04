import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  login: string;
  password: string;
  isError: boolean;
  message: string;

  constructor(
      private router: Router,
      private authService: AuthService
  ){}

  ngOnInit() {
      // const isLoggedIn: boolean = this.authService.loggedIn();
      // if (isLoggedIn) {
      //     this.router.navigate(['/']);
      // }
  }

  onSubmit = async () => {
    const {email, password} = this.form.value;

    this.isError = await this.authService.signIn(email, password);
    this.message = 'Wrong login or password';
    this.form.value.email = '';
    this.form.value.password = '';
  }

  onSignUp = async () => {
    this.router.navigate(['/']);
  }

  onReset = async () => {
    this.message = await this.authService.ResetPassword();
    this.isError = true;
  }
}
