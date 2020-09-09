import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    isError: boolean;
    message: string;

    constructor(
        private authService: AuthService,
    ){}

    ngOnInit() {}

    onSubmit = async ({email}) => {
        this.message = await this.authService.resetPassword(email);
        this.isError = true;
    }
}
