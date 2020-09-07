import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-sing-up',
    templateUrl: './sing-up.component.html',
    styleUrls: ['./sing-up.component.scss']
})
export class SingUpComponent implements OnInit {
    isError: boolean;
    message: string;

    constructor(
        private authService: AuthService,
    ){}

    ngOnInit() {}

    onSubmit = async (data) => {
        if (data.repeatPassword === data.password) {
            this.isError = await this.authService.signUp(data);
            this.message = 'This already email exists';
        } else {
            this.message = 'The fields password and repeat password do not match.';
            this.isError = true;
        }
    }
}
