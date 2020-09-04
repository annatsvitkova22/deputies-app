import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-sing-up',
    templateUrl: './sing-up.component.html',
    styleUrls: ['./sing-up.component.scss']
})
export class SingUpComponent implements OnInit {
    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        name: new FormControl('', [Validators.required])
    });
    login: string;
    password: string;
    isError: boolean;
    message: string;

    constructor(
        private authService: AuthService,
    ){}

    ngOnInit() {
        // const isLoggedIn: boolean = this.authService.loggedIn();
        // if (isLoggedIn) {
        //     this.router.navigate(['/']);
        // }
    }

    onSubmit = async () => {
        const data = this.form.value;
        if (data.repeatPassword === data.password) {
            this.isError = await this.authService.signUp(data);
            this.message = 'This already email exists';
            this.form.value.email = '';
            this.form.value.password = '';
        } else {
            this.message = 'The fields password and repeat password do not match.';
            this.isError = true;
        }
    }
}
